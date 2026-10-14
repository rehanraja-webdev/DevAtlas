import vm from "vm";
import mongoose from "mongoose";
import Lesson from "../models/Lesson.js";
import Quiz from "../models/Quiz.js";
import Exercise from "../models/Exercise.js";
import Attempt from "../models/Attempt.js";
import UserRoadmap from "../models/UserRoadmap.js";
import { createActivity } from "./activity.service.js";
import { deleteCache } from "../utils/cache.js";

/**
 * Fetch all published lessons, optionally filtered by topicKey
 */
export const getLessonsService = async (filter = {}) => {
  const query = { isPublished: true };
  if (filter.topicKey) query.topicKey = filter.topicKey;

  const lessons = await Lesson.find(query)
    .select("topicKey title estimatedTime videoURL quizId exerciseId dependencies")
    .sort({ createdAt: 1 });

  return lessons;
};

/**
 * Fetch a single lesson by ID or topicKey, populating quiz & exercise public metadata
 */
export const getLessonDetailsService = async (identifier) => {
  let query = {};
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    query = { _id: identifier };
  } else {
    query = { topicKey: identifier };
  }

  const lesson = await Lesson.findOne(query)
    .populate({
      path: "quizId",
      select: "-questions.correctAnswer", // NEVER leak answers to client
    })
    .populate({
      path: "exerciseId",
      select: "-solutionCode", // NEVER leak solution to client
    });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  return lesson;
};

/**
 * Fetch a quiz by ID or topicKey, stripping correct answers for anti-cheat
 */
export const getQuizService = async (identifier) => {
  let query = {};
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    query = { _id: identifier };
  } else {
    query = { topicKey: identifier };
  }

  const quiz = await Quiz.findOne(query).select("-questions.correctAnswer");

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  return quiz;
};

/**
 * Server-side quiz evaluation & mastery verification
 */
export const submitQuizAttemptService = async (
  userId,
  quizId,
  userAnswers = {},
  durationSec = 0,
) => {
  // 1. Fetch full quiz INCLUDING correct answers for server-side evaluation
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new Error("Quiz not found");
  }

  let totalScore = 0;
  let totalPoints = 0;
  const breakdown = [];

  quiz.questions.forEach((q, idx) => {
    const qKey = q._id ? q._id.toString() : String(idx);
    const submittedVal = userAnswers[qKey] !== undefined ? userAnswers[qKey] : userAnswers[String(idx)];
    const isCorrect =
      submittedVal !== undefined &&
      String(submittedVal).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();

    const qPoints = q.points || 25;
    totalPoints += qPoints;

    if (isCorrect) {
      totalScore += qPoints;
    }

    breakdown.push({
      questionId: q._id,
      question: q.question,
      submittedAnswer: submittedVal || null,
      isCorrect,
      explanation: q.explanation || "",
      correctAnswer: q.correctAnswer, // Revealed only AFTER grading
    });
  });

  const percentage = Math.round((totalScore / (totalPoints || 1)) * 100);
  const passed = percentage >= (quiz.passingScore || 80);

  // 2. Persist Attempt audit record
  const attempt = await Attempt.create({
    user: userId,
    lesson: quiz.lessonId,
    quiz: quiz._id,
    topicKey: quiz.topicKey,
    type: "quiz",
    answers: userAnswers,
    score: percentage,
    passed,
    details: { breakdown, passingScore: quiz.passingScore },
    durationSec: Number(durationSec) || 0,
    feedback: passed
      ? `Mastery achieved! Score: ${percentage}% (Passing threshold: ${quiz.passingScore}%)`
      : `Mastery check failed: ${percentage}% achieved. Minimum ${quiz.passingScore}% required to master topic.`,
  });

  // 3. Log user activity
  try {
    await createActivity(userId, "quiz_attempted", "quiz", quiz._id, {
      topicKey: quiz.topicKey,
      score: percentage,
      passed,
      quizTitle: quiz.title,
    });
  } catch (err) {
    console.error("Failed to log quiz activity:", err.message);
  }

  // 4. If passed at mastery threshold, update active UserRoadmap progress!
  let roadmapUpdated = false;
  if (passed) {
    const userRoadmap = await UserRoadmap.findOne({ user: userId })
      .sort({ updatedAt: -1 })
      .populate("roadmap");

    if (userRoadmap) {
      const pItem = userRoadmap.progress.find((p) => p.itemKey === quiz.topicKey);
      if (pItem) {
        pItem.quizScore = percentage;
        pItem.verifiedMastery = true;
        pItem.progressPercent = 100;
        pItem.status = "completed";
        pItem.completedAt = new Date();
        pItem.lastAttemptAt = new Date();

        // Unlock dependent downstream milestones
        userRoadmap.progress.forEach((targetItem) => {
          if (targetItem.status === "locked") {
            const rItem = userRoadmap.roadmap.items.find((i) => i.key === targetItem.itemKey);
            if (rItem && rItem.dependencies?.length > 0) {
              const allMet = rItem.dependencies.every((depKey) => {
                const dProg = userRoadmap.progress.find((p) => p.itemKey === depKey);
                return dProg?.status === "completed" || dProg?.verifiedMastery === true;
              });
              if (allMet) {
                targetItem.status = "not-started";
              }
            }
          }
        });

        const completedCount = userRoadmap.progress.filter(
          (p) => p.status === "completed" || p.verifiedMastery === true,
        ).length;

        userRoadmap.overallProgress = Math.round(
          (completedCount / userRoadmap.progress.length) * 100,
        );
        userRoadmap.updatedAt = new Date();
        await userRoadmap.save();
        roadmapUpdated = true;
        await deleteCache(`analytics:overview:${userId}`);
      }
    }
  }

  return {
    attemptId: attempt._id,
    score: percentage,
    passed,
    passingScore: quiz.passingScore || 80,
    feedback: attempt.feedback,
    breakdown,
    roadmapUpdated,
  };
};

/**
 * Server-side sandboxed code exercise execution and test validation
 */
export const submitExerciseService = async (
  userId,
  exerciseId,
  submittedCode,
  durationSec = 0,
) => {
  const exercise = await Exercise.findById(exerciseId);
  if (!exercise) {
    throw new Error("Exercise not found");
  }

  const testResults = [];
  let passedTests = 0;

  for (const test of exercise.tests) {
    let actualOutput = null;
    let passed = false;
    let executionError = null;

    try {
      // Execute in isolated Node.js VM context with 1500ms timeout
      const sandbox = {
        console: { log: () => {} },
        setTimeout: () => {},
      };
      vm.createContext(sandbox);

      const scriptCode = `
        ${submittedCode}
        (function() {
          try {
            const res = eval(${JSON.stringify(test.input)});
            return typeof res === 'object' ? JSON.stringify(res) : String(res);
          } catch(e) {
            return "ERROR: " + e.message;
          }
        })()
      `;

      const result = vm.runInContext(scriptCode, sandbox, {
        timeout: 1500,
      });

      actualOutput = String(result);
      passed = actualOutput === String(test.expectedOutput);
    } catch (err) {
      executionError = err.message;
      actualOutput = `Runtime Error: ${err.message}`;
      passed = false;
    }

    if (passed) passedTests++;

    testResults.push({
      testId: test._id,
      description: test.description,
      input: test.input,
      expectedOutput: test.expectedOutput,
      actualOutput,
      passed,
      error: executionError,
    });
  }

  const score = Math.round((passedTests / (exercise.tests.length || 1)) * 100);
  const passed = score === 100;

  const attempt = await Attempt.create({
    user: userId,
    lesson: exercise.lessonId,
    exercise: exercise._id,
    topicKey: exercise.topicKey,
    type: "exercise",
    answers: submittedCode,
    score,
    passed,
    details: { testResults, totalTests: exercise.tests.length, passedTests },
    durationSec: Number(durationSec) || 0,
    feedback: passed
      ? "All test cases passed! Exercise successfully completed."
      : `${passedTests} of ${exercise.tests.length} tests passed. Review failed test cases and retry.`,
  });

  try {
    await createActivity(userId, "exercise_submitted", "exercise", exercise._id, {
      topicKey: exercise.topicKey,
      score,
      passed,
      exerciseTitle: exercise.title,
    });
  } catch (err) {
    console.error("Failed to log exercise activity:", err.message);
  }

  if (passed) {
    const userRoadmap = await UserRoadmap.findOne({ user: userId })
      .sort({ updatedAt: -1 })
      .populate("roadmap");

    if (userRoadmap) {
      const pItem = userRoadmap.progress.find((p) => p.itemKey === exercise.topicKey);
      if (pItem) {
        pItem.exercisePassed = true;
        await userRoadmap.save();
      }
    }
  }

  return {
    attemptId: attempt._id,
    score,
    passed,
    feedback: attempt.feedback,
    testResults,
  };
};

/**
 * Fetch user's attempt records for a specific topic or quiz
 */
export const getUserAttemptsService = async (userId, filter = {}) => {
  const query = { user: userId };
  if (filter.topicKey) query.topicKey = filter.topicKey;
  if (filter.quizId) query.quiz = filter.quizId;
  if (filter.type) query.type = filter.type;

  const attempts = await Attempt.find(query)
    .select("topicKey type score passed durationSec feedback createdAt")
    .sort({ createdAt: -1 })
    .limit(20);

  return attempts;
};

/**
 * Aggregated learning analytics
 */
export const getLearningAnalyticsService = async (userId) => {
  const attempts = await Attempt.find({ user: userId });
  const totalAttempts = attempts.length;
  const passedQuizzes = attempts.filter((a) => a.type === "quiz" && a.passed).length;
  const passedExercises = attempts.filter((a) => a.type === "exercise" && a.passed).length;

  const quizScores = attempts.filter((a) => a.type === "quiz").map((a) => a.score);
  const avgScore =
    quizScores.length > 0
      ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
      : 0;

  return {
    totalAttempts,
    passedQuizzes,
    passedExercises,
    avgScore,
  };
};
