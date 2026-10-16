import mongoose from "mongoose";
import Lesson from "../models/Lesson.js";
import Assessment from "../models/Assessment.js";
import LearningAttempt from "../models/LearningAttempt.js";
import SkillEvidence from "../models/SkillEvidence.js";
import SkillMastery from "../models/SkillMastery.js";
import Skill from "../models/Skill.js";
import UserRoadmap from "../models/UserRoadmap.js";
import Quiz from "../models/Quiz.js";
import Attempt from "../models/Attempt.js";
import { createActivity } from "./activity.service.js";
import { deleteCache } from "../utils/cache.js";
import { ApiError } from "../utils/ApiError.js";

const SPACING_INTERVALS_DAYS = [1, 3, 7, 14, 30];

/**
 * Server-authoritative assessment grading.
 * Enforces anti-cheat (hidden answers), idempotency, and immutable attempt recording.
 */
export const gradeAssessment = async ({
  userId,
  assessmentId,
  topicKey,
  answers = {},
  durationSec = 0,
  idempotencyKey = null,
}) => {
  if (!userId) {
    throw new ApiError(401, "Authentication required to submit assessment");
  }

  // 1. Idempotency Check: Prevent duplicate grading or score inflation
  if (idempotencyKey) {
    const existingAttempt = await LearningAttempt.findOne({
      user: userId,
      idempotencyKey,
    });
    if (existingAttempt) {
      return {
        attemptId: existingAttempt._id,
        score: existingAttempt.score,
        passed: existingAttempt.passed,
        feedback: existingAttempt.feedback,
        breakdown: existingAttempt.details?.breakdown || [],
        isDuplicate: true,
      };
    }
  }

  // 2. Fetch Assessment including server-held correct answers
  let assessment = null;
  if (assessmentId && mongoose.Types.ObjectId.isValid(assessmentId)) {
    assessment = await Assessment.findById(assessmentId).select(
      "+questions.correctAnswer +questions.explanation",
    );
  }

  if (!assessment && topicKey) {
    assessment = await Assessment.findOne({ topicKey, status: "published" })
      .sort({ version: -1 })
      .select("+questions.correctAnswer +questions.explanation");
  }

  // Legacy fallback to Quiz model if Assessment collection not yet seeded for this topic
  let legacyQuiz = null;
  if (!assessment) {
    let quizQuery = {};
    if (assessmentId && mongoose.Types.ObjectId.isValid(assessmentId)) {
      quizQuery = { _id: assessmentId };
    } else if (topicKey) {
      quizQuery = { topicKey };
    }
    legacyQuiz = await Quiz.findOne(quizQuery);
    if (!legacyQuiz) {
      throw new ApiError(404, "Assessment or quiz not found for evaluation");
    }
  }

  const questions = assessment ? assessment.questions : legacyQuiz.questions;
  const passingScore = assessment ? assessment.passingScore : legacyQuiz.passingScore || 80;
  const resolvedTopicKey = assessment ? assessment.topicKey : legacyQuiz.topicKey;
  const assessmentVersion = assessment ? assessment.version : 1;

  let totalScore = 0;
  let totalPoints = 0;
  const breakdown = [];

  questions.forEach((q, idx) => {
    const qKey = q._id ? q._id.toString() : String(idx);
    const submittedVal = answers[qKey] !== undefined ? answers[qKey] : answers[String(idx)];
    const correctAnswer = q.correctAnswer;
    const isCorrect =
      submittedVal !== undefined &&
      String(submittedVal).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();

    const points = q.points || 25;
    totalPoints += points;
    if (isCorrect) totalScore += points;

    breakdown.push({
      questionId: q._id,
      question: q.question,
      submittedAnswer: submittedVal !== undefined ? submittedVal : null,
      isCorrect,
      explanation: q.explanation || "Review the lesson materials and core principles.",
      correctAnswer, // Revealed only AFTER grading
      misconceptionKey: q.misconceptionKey || null,
    });
  });

  const percentage = Math.round((totalScore / (totalPoints || 1)) * 100);
  const passed = percentage >= passingScore;

  const feedback = passed
    ? `Mastery achieved! Score: ${percentage}% (Passing threshold: ${passingScore}%). Topic verified.`
    : `Assessment score: ${percentage}%. Passing threshold is ${passingScore}%. Review the explanations below and retry.`;

  // 3. Persist immutable LearningAttempt
  const attempt = await LearningAttempt.create({
    user: userId,
    assessment: assessment?._id || null,
    assessmentVersion,
    lesson: assessment?.lessonId || legacyQuiz?.lessonId || null,
    topicKey: resolvedTopicKey,
    type: "quiz",
    responses: answers,
    score: percentage,
    passed,
    feedback,
    details: { breakdown, passingScore },
    durationSec: Number(durationSec) || 0,
    idempotencyKey: idempotencyKey || undefined,
  });

  // Also record in legacy Attempt model for backwards compatibility with any existing queries
  try {
    await Attempt.create({
      user: userId,
      lesson: assessment?.lessonId || legacyQuiz?.lessonId,
      quiz: legacyQuiz?._id,
      topicKey: resolvedTopicKey,
      type: "quiz",
      answers,
      score: percentage,
      passed,
      details: { breakdown, passingScore },
      durationSec: Number(durationSec) || 0,
      feedback,
    });
  } catch (err) {
    // Non-blocking fallback
  }

  // 4. Record SkillEvidence
  const evidence = await SkillEvidence.create({
    user: userId,
    skillKey: resolvedTopicKey,
    sourceType: "assessment",
    sourceId: attempt._id,
    score: percentage,
    rubric: { passingScore, totalScore, totalPoints },
    verifiedAt: new Date(),
    contentVersion: assessmentVersion,
    notes: passed ? "Passed verified mastery quiz" : "Attempt below mastery threshold",
  });

  // 5. Update SkillMastery State Machine
  const mastery = await evaluateMastery(userId, resolvedTopicKey, evidence);

  // 6. If passed, schedule next spaced retention review
  if (passed) {
    await scheduleNextReview({
      userId,
      skillKey: resolvedTopicKey,
      passed: true,
      fromDate: attempt.createdAt,
    });
  }

  // 7. Refresh UserRoadmap progress strictly from server verified attempts
  await refreshRoadmapProgress(userId);

  // 8. Invalidate Redis Caches
  await deleteCache(`analytics:overview:${userId}`);
  await deleteCache(`mastery:${userId}`);
  await deleteCache(`learning:next:${userId}`);

  // 9. Telemetry Activity Log
  try {
    await createActivity(userId, "quiz_attempted", "quiz", attempt._id, {
      topicKey: resolvedTopicKey,
      score: percentage,
      passed,
      assessmentVersion,
    });
  } catch (err) {
    console.error("Telemetry event failed:", err.message);
  }

  return {
    attemptId: attempt._id,
    score: percentage,
    passed,
    passingScore,
    feedback,
    breakdown,
    masteryState: mastery.state,
    nextReviewAt: mastery.nextReviewAt,
  };
};

/**
 * Evaluates evidence and determines skill mastery state:
 * - not_assessed: No valid attempts yet
 * - learning: Lesson opened or in progress
 * - practised: Assessment attempted but score < 80%
 * - demonstrated: Assessment passed >= 80%
 * - retained: Spaced retention review successfully passed
 */
export const evaluateMastery = async (userId, skillKey, latestEvidence = null) => {
  const allEvidence = await SkillEvidence.find({
    user: userId,
    skillKey: skillKey.toLowerCase(),
  }).sort({ verifiedAt: -1 });

  const passedEvidence = allEvidence.filter((e) => e.score >= 80);
  const retentionEvidence = allEvidence.filter(
    (e) => e.sourceType === "retention_review" && e.score >= 80,
  );

  let state = "not_assessed";
  let rationale = "No assessment evidence recorded.";

  if (retentionEvidence.length > 0) {
    state = "retained";
    rationale = `Demonstrated and verified through spaced retention review with ${retentionEvidence[0].score}% score.`;
  } else if (passedEvidence.length > 0) {
    state = "demonstrated";
    rationale = `Passed server-verified assessment with score ${passedEvidence[0].score}% (threshold: 80%).`;
  } else if (allEvidence.length > 0) {
    state = "practised";
    rationale = `Attempt recorded with score ${allEvidence[0].score}%. Passing threshold (80%) not yet reached.`;
  }

  const latestScore = allEvidence.length > 0 ? allEvidence[0].score : null;
  const lastAssessedAt = allEvidence.length > 0 ? allEvidence[0].verifiedAt : null;

  // Upsert SkillMastery
  const mastery = await SkillMastery.findOneAndUpdate(
    { user: userId, skillKey: skillKey.toLowerCase() },
    {
      $set: {
        skillName: skillKey.charAt(0).toUpperCase() + skillKey.slice(1),
        state,
        latestScore,
        lastAssessedAt,
        rationale,
      },
      $addToSet: {
        evidence: {
          $each: allEvidence.map((e) => e._id),
        },
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  );

  // Sync to user's Skill inventory as verified
  try {
    await Skill.findOneAndUpdate(
      { user: userId, name: new RegExp(`^${skillKey}$`, "i") },
      {
        $set: {
          proficiency: latestScore || 70,
          source: state === "demonstrated" || state === "retained" ? "verified" : "self_reported",
          verifiedMasteryId: mastery._id,
          lastVerifiedAt: lastAssessedAt,
        },
      },
      { upsert: false },
    );
  } catch (err) {
    // Non-blocking
  }

  return mastery;
};

/**
 * Recalculate UserRoadmap progress strictly from server-recorded attempts and mastery.
 * Guarantees that clients cannot forge progress percent or bypass prerequisite gates.
 */
export const refreshRoadmapProgress = async (userId) => {
  const userRoadmap = await UserRoadmap.findOne({ user: userId })
    .sort({ updatedAt: -1 })
    .populate("roadmap");

  if (!userRoadmap || !userRoadmap.progress || userRoadmap.progress.length === 0) {
    return userRoadmap;
  }

  // 1. Fetch all genuinely passed attempts for this user
  const passedAttempts = await LearningAttempt.find({
    user: userId,
    passed: true,
  }).sort({ score: -1 });

  const passedMap = new Map();
  passedAttempts.forEach((att) => {
    if (!passedMap.has(att.topicKey)) {
      passedMap.set(att.topicKey, att);
    }
  });

  // Check fallback attempts
  const fallbackAttempts = await Attempt.find({
    user: userId,
    passed: true,
  }).sort({ score: -1 });

  fallbackAttempts.forEach((att) => {
    if (!passedMap.has(att.topicKey)) {
      passedMap.set(att.topicKey, att);
    }
  });

  let changed = false;

  // 2. Audit milestones against verified evidence
  userRoadmap.progress.forEach((pItem) => {
    const passedAtt = passedMap.get(pItem.itemKey);
    if (passedAtt) {
      if (
        !pItem.verifiedMastery ||
        pItem.status !== "completed" ||
        pItem.progressPercent !== 100
      ) {
        pItem.verifiedMastery = true;
        pItem.masteryState = "demonstrated";
        pItem.progressSource = "verified_evidence";
        pItem.quizScore = passedAtt.score;
        pItem.status = "completed";
        pItem.progressPercent = 100;
        if (!pItem.completedAt) pItem.completedAt = passedAtt.createdAt || new Date();
        changed = true;
      }
    } else {
      // No passed attempt exists on server! Revoke any unverified completion.
      if (pItem.verifiedMastery || pItem.status === "completed" || pItem.progressPercent === 100) {
        pItem.verifiedMastery = false;
        pItem.masteryState = pItem.progressPercent > 0 ? "in_progress" : "not_started";
        pItem.status = pItem.progressPercent > 0 ? "in-progress" : "not-started";
        pItem.progressPercent = pItem.progressPercent === 100 ? 40 : pItem.progressPercent;
        pItem.completedAt = null;
        changed = true;
      }
    }
  });

  // 3. Re-evaluate prerequisite gates
  if (userRoadmap.roadmap && userRoadmap.roadmap.items) {
    userRoadmap.progress.forEach((pItem) => {
      if (pItem.verifiedMastery || pItem.status === "completed") return;

      const rItem = userRoadmap.roadmap.items.find((i) => i.key === pItem.itemKey);
      if (rItem && rItem.dependencies?.length > 0) {
        const allDepsMet = rItem.dependencies.every((depKey) => {
          const depProg = userRoadmap.progress.find((p) => p.itemKey === depKey);
          return depProg && (depProg.status === "completed" || depProg.verifiedMastery === true);
        });

        if (allDepsMet && pItem.status === "locked") {
          pItem.status = "not-started";
          changed = true;
        } else if (!allDepsMet && pItem.status !== "locked") {
          pItem.status = "locked";
          pItem.progressPercent = 0;
          changed = true;
        }
      } else if (
        (!rItem || !rItem.dependencies || rItem.dependencies.length === 0) &&
        pItem.status === "locked"
      ) {
        pItem.status = "not-started";
        changed = true;
      }
    });
  }

  // 4. Derive overall progress mathematically
  const completedCount = userRoadmap.progress.filter(
    (item) => item.status === "completed" || item.verifiedMastery === true,
  ).length;

  const inProgressSum = userRoadmap.progress
    .filter((item) => item.status === "in-progress" && !item.verifiedMastery)
    .reduce((acc, curr) => acc + (curr.progressPercent || 0), 0);

  const totalItems = userRoadmap.progress.length || 1;
  const calculatedOverall = Math.min(
    100,
    Math.round(((completedCount * 100 + inProgressSum) / (totalItems * 100)) * 100),
  );

  if (userRoadmap.overallProgress !== calculatedOverall) {
    userRoadmap.overallProgress = calculatedOverall;
    changed = true;
  }

  if (changed) {
    userRoadmap.updatedAt = new Date();
    await userRoadmap.save();
  }

  return userRoadmap;
};

/**
 * Spaced repetition review scheduler.
 * Implements 1d, 3d, 7d, 14d, 30d retrieval intervals.
 */
export const scheduleNextReview = async ({
  userId,
  skillKey,
  passed,
  fromDate = new Date(),
}) => {
  let mastery = await SkillMastery.findOne({
    user: userId,
    skillKey: skillKey.toLowerCase(),
  });

  const currentInterval = mastery?.intervalDays || 1;
  let newInterval = 1;

  if (passed) {
    const currentIndex = SPACING_INTERVALS_DAYS.indexOf(currentInterval);
    if (currentIndex !== -1 && currentIndex < SPACING_INTERVALS_DAYS.length - 1) {
      newInterval = SPACING_INTERVALS_DAYS[currentIndex + 1];
    } else if (currentIndex === SPACING_INTERVALS_DAYS.length - 1) {
      newInterval = 30;
    } else {
      newInterval = 3;
    }
  } else {
    // Failed retrieval resets interval to 1 day for remediation
    newInterval = 1;
  }

  const baseDate = fromDate instanceof Date ? fromDate : new Date(fromDate);
  const nextReviewAt = new Date(baseDate.getTime() + newInterval * 24 * 60 * 60 * 1000);

  mastery = await SkillMastery.findOneAndUpdate(
    { user: userId, skillKey: skillKey.toLowerCase() },
    {
      $set: {
        intervalDays: newInterval,
        nextReviewAt,
        retentionStatus: "current",
      },
      $push: {
        reviewHistory: {
          reviewedAt: new Date(),
          score: passed ? 100 : 0,
          passed,
          previousIntervalDays: currentInterval,
          newIntervalDays: newInterval,
        },
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  return mastery;
};

/**
 * Adaptive Next Step Recommendation Engine (Feature B).
 * Explainable, rules-based next best action.
 */
export const getAdaptiveNextAction = async (userId) => {
  const now = new Date();

  // 1. Priority 1: Due or Overdue Spaced Retention Review
  const dueReview = await SkillMastery.findOne({
    user: userId,
    nextReviewAt: { $lte: now },
    state: { $in: ["demonstrated", "retained"] },
  }).sort({ nextReviewAt: 1 });

  if (dueReview) {
    return {
      actionType: "spaced_review",
      title: `Retention Review: ${dueReview.skillName}`,
      topicKey: dueReview.skillKey,
      reason: `Scheduled retrieval interval reached. A quick 3-minute quiz locks ${dueReview.skillName} into long-term memory.`,
      estimatedMinutes: 5,
      targetUrl: `/roadmap?review=${dueReview.skillKey}`,
      urgency: "high",
    };
  }

  // 2. Priority 2: Remediation for Recently Failed Assessment (<80%)
  const recentFailedAttempt = await LearningAttempt.findOne({
    user: userId,
    passed: false,
  }).sort({ createdAt: -1 });

  if (recentFailedAttempt) {
    const isNowPassed = await LearningAttempt.exists({
      user: userId,
      topicKey: recentFailedAttempt.topicKey,
      passed: true,
      createdAt: { $gt: recentFailedAttempt.createdAt },
    });

    if (!isNowPassed) {
      return {
        actionType: "remediation",
        title: `Targeted Remediation: ${recentFailedAttempt.topicKey.toUpperCase()}`,
        topicKey: recentFailedAttempt.topicKey,
        reason: `Your previous assessment was ${recentFailedAttempt.score}%. Study the core misconceptions and retake the 5-question mastery check.`,
        estimatedMinutes: 15,
        targetUrl: `/roadmap?topic=${recentFailedAttempt.topicKey}`,
        urgency: "medium",
      };
    }
  }

  // 3. Priority 3: Active Roadmap Unlocked Milestone
  const userRoadmap = await UserRoadmap.findOne({ user: userId })
    .sort({ updatedAt: -1 })
    .populate("roadmap");

  if (userRoadmap && userRoadmap.progress) {
    // Find milestone in progress
    const inProgressItem = userRoadmap.progress.find((p) => p.status === "in-progress");
    if (inProgressItem) {
      const rItem = userRoadmap.roadmap?.items?.find((i) => i.key === inProgressItem.itemKey);
      return {
        actionType: "continue_milestone",
        title: `Continue: ${rItem?.title || inProgressItem.itemKey}`,
        topicKey: inProgressItem.itemKey,
        reason: "You have started this milestone. Complete the lesson tutorial and pass the server assessment.",
        estimatedMinutes: 20,
        targetUrl: `/roadmap?topic=${inProgressItem.itemKey}`,
        urgency: "normal",
      };
    }

    // Find next unlocked milestone
    const nextUnlocked = userRoadmap.progress.find((p) => p.status === "not-started");
    if (nextUnlocked) {
      const rItem = userRoadmap.roadmap?.items?.find((i) => i.key === nextUnlocked.itemKey);
      return {
        actionType: "start_milestone",
        title: `Next Up: ${rItem?.title || nextUnlocked.itemKey}`,
        topicKey: nextUnlocked.itemKey,
        reason: `Prerequisites completed! Unlock your next milestone on the ${userRoadmap.roadmap?.title || "career"} track.`,
        estimatedMinutes: 25,
        targetUrl: `/roadmap?topic=${nextUnlocked.itemKey}`,
        urgency: "normal",
      };
    }
  }

  // Default Fallback
  return {
    actionType: "explore_roadmaps",
    title: "Explore Full-Stack Tracks & DSA",
    topicKey: "general",
    reason: "Start your active career roadmap to unlock evidence-based mastery tracking.",
    estimatedMinutes: 15,
    targetUrl: "/roadmap",
    urgency: "low",
  };
};

/**
 * Builds weekly sprint containing:
 * - 1 concept to learn
 * - 1 retrieval/practice task
 * - 1 application task
 */
export const buildWeeklySprint = async (userId) => {
  const nextAction = await getAdaptiveNextAction(userId);

  const sprint = [
    {
      id: "action-1-learn",
      category: "Concept Learning",
      title: nextAction.title,
      topicKey: nextAction.topicKey,
      reason: nextAction.reason,
      estimatedMinutes: nextAction.estimatedMinutes,
      status: "pending",
      completionSignal: "Pass server assessment with ≥80%",
    },
    {
      id: "action-2-practice",
      category: "Retrieval & Practice",
      title: "Spaced Retention Check & DSA Practice",
      topicKey: nextAction.topicKey,
      reason: "Solve 1 targeted problem to reinforce active recall.",
      estimatedMinutes: 15,
      status: "pending",
      completionSignal: "Submit solved problem test cases",
    },
    {
      id: "action-3-apply",
      category: "Practical Application",
      title: "Production Scenario Lab / Project Milestone",
      topicKey: nextAction.topicKey,
      reason: "Apply learned principles to code review or debugging scenario.",
      estimatedMinutes: 25,
      status: "pending",
      completionSignal: "Complete lab rubric check",
    },
  ];

  return sprint;
};

/**
 * Generates verified Skill Passport data (Feature A).
 * Explicitly sanitizes private attempt answers, secrets, or internal flags.
 */
export const getSkillPassport = async (userId) => {
  const masteries = await SkillMastery.find({ user: userId }).populate({
    path: "evidence",
    select: "sourceType score verifiedAt contentVersion notes",
  });

  const verifiedSkills = masteries
    .filter((m) => m.state === "demonstrated" || m.state === "retained")
    .map((m) => ({
      skillKey: m.skillKey,
      skillName: m.skillName,
      category: m.category,
      state: m.state,
      latestScore: m.latestScore,
      lastAssessedAt: m.lastAssessedAt,
      nextReviewAt: m.nextReviewAt,
      rationale: m.rationale,
      evidenceCount: m.evidence?.length || 0,
      evidenceSummary: (m.evidence || []).map((e) => ({
        type: e.sourceType,
        score: e.score,
        date: e.verifiedAt,
      })),
    }));

  const inProgressSkills = masteries
    .filter((m) => m.state === "practised" || m.state === "learning")
    .map((m) => ({
      skillKey: m.skillKey,
      skillName: m.skillName,
      state: m.state,
      latestScore: m.latestScore,
      rationale: m.rationale,
    }));

  return {
    verifiedCount: verifiedSkills.length,
    verifiedSkills,
    inProgressSkills,
    generatedAt: new Date(),
    integrity: "Server-Verified Telemetry Engine",
  };
};

/**
 * Retrieves due reviews for user
 */
export const getDueReviews = async (userId) => {
  const now = new Date();
  const dueReviews = await SkillMastery.find({
    user: userId,
    state: { $in: ["demonstrated", "retained", "practised"] },
  }).sort({ nextReviewAt: 1 });

  return dueReviews.map((m) => ({
    skillKey: m.skillKey,
    skillName: m.skillName,
    state: m.state,
    intervalDays: m.intervalDays,
    nextReviewAt: m.nextReviewAt,
    isOverdue: m.nextReviewAt ? m.nextReviewAt <= now : false,
  }));
};
