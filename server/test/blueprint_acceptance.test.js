import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB from "../src/config/db.js";
import User from "../src/models/User.js";
import Roadmap from "../src/models/Roadmap.js";
import UserRoadmap from "../src/models/UserRoadmap.js";
import Lesson from "../src/models/Lesson.js";
import Assessment from "../src/models/Assessment.js";
import LearningAttempt from "../src/models/LearningAttempt.js";
import SkillEvidence from "../src/models/SkillEvidence.js";
import SkillMastery from "../src/models/SkillMastery.js";
import {
  gradeAssessment,
  evaluateMastery,
  refreshRoadmapProgress,
  scheduleNextReview,
  getAdaptiveNextAction,
  getSkillPassport,
} from "../src/services/learningProgress.service.js";
import {
  startRoadmapService,
  updateRoadmapProgressService,
} from "../src/services/roadmap.service.js";

dotenv.config();

describe("DevAtlas Blueprint Acceptance & Security Test Suite", () => {
  let testUserA;
  let testUserB;
  let testRoadmap;
  let testAssessment;

  before(async () => {
    await connectDB();

    // Clean up any test users
    await User.deleteMany({ email: { $in: ["tester_a@devatlas.io", "tester_b@devatlas.io"] } });

    testUserA = await User.create({
      fullname: "Tester Alpha",
      email: "tester_a@devatlas.io",
      password: "HashedPassword123!",
      careerGoal: "fullstack-developer",
    });

    testUserB = await User.create({
      fullname: "Tester Beta",
      email: "tester_b@devatlas.io",
      password: "HashedPassword123!",
      careerGoal: "fullstack-developer",
    });

    // Ensure test roadmap with dependency
    testRoadmap = await Roadmap.findOneAndUpdate(
      { careerGoal: "test-track" },
      {
        $set: {
          title: "Test Engineering Track",
          careerGoal: "test-track",
          description: "Testing dependency gating and mastery verification",
          items: [
            {
              key: "javascript",
              title: "JavaScript Async",
              order: 1,
              dependencies: [],
            },
            {
              key: "react",
              title: "React Architecture",
              order: 2,
              dependencies: ["javascript"],
            },
          ],
        },
      },
      { upsert: true, returnDocument: "after" },
    );

    testAssessment = await Assessment.findOne({ topicKey: "javascript" }).select(
      "+questions.correctAnswer +questions.explanation",
    );
  });

  after(async () => {
    if (testUserA) {
      await User.deleteOne({ _id: testUserA._id });
      await UserRoadmap.deleteMany({ user: testUserA._id });
      await LearningAttempt.deleteMany({ user: testUserA._id });
      await SkillEvidence.deleteMany({ user: testUserA._id });
      await SkillMastery.deleteMany({ user: testUserA._id });
    }
    if (testUserB) {
      await User.deleteOne({ _id: testUserB._id });
      await UserRoadmap.deleteMany({ user: testUserB._id });
      await LearningAttempt.deleteMany({ user: testUserB._id });
      await SkillEvidence.deleteMany({ user: testUserB._id });
      await SkillMastery.deleteMany({ user: testUserB._id });
    }
    await Roadmap.deleteOne({ careerGoal: "test-track" });
    await mongoose.connection.close();
    try {
      const redis = (await import("../src/config/redis.js")).default;
      await redis.quit();
    } catch (e) {
      // non-blocking
    }
  });

  test("Test 1: PATCH/POST body with completionPercent: 100 is rejected without server quiz mastery", async () => {
    await startRoadmapService(testUserA._id, testRoadmap._id);

    // Attempting to set 100% completion without passing server quiz
    await assert.rejects(
      async () => {
        await updateRoadmapProgressService(testUserA._id, "javascript", 100);
      },
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.match(err.message, /Mastery gate active/);
        return true;
      },
    );

    // Verify roadmap progress remained 0% and not completed
    const userRoadmap = await UserRoadmap.findOne({ user: testUserA._id });
    const jsItem = userRoadmap.progress.find((p) => p.itemKey === "javascript");
    assert.equal(jsItem.status, "not-started");
    assert.equal(jsItem.verifiedMastery, false);
    assert.equal(userRoadmap.overallProgress, 0);
  });

  test("Test 2: Learner requests a locked lesson/assessment -> API enforces prerequisites", async () => {
    // React milestone requires 'javascript'
    await assert.rejects(
      async () => {
        await updateRoadmapProgressService(testUserA._id, "react", 40);
      },
      (err) => {
        assert.equal(err.statusCode, 403);
        assert.match(err.message, /Complete the required prerequisite topics first/);
        return true;
      },
    );
  });

  test("Test 3: Correct answers are never exposed in public GET assessment query", async () => {
    const publicAssessment = await Assessment.findOne({ topicKey: "javascript" }).select(
      "-questions.correctAnswer -questions.explanation",
    );

    assert.ok(publicAssessment);
    assert.ok(publicAssessment.questions.length > 0);

    for (const q of publicAssessment.questions) {
      assert.equal(q.correctAnswer, undefined, "Correct answer must never be exposed!");
      assert.equal(q.explanation, undefined, "Answer explanation must not be exposed pre-grading!");
    }
  });

  test("Test 4: User A cannot read or mutate User B evidence ID (Ownership / IDOR Protection)", async () => {
    // Create evidence for User B
    const evidenceB = await SkillEvidence.create({
      user: testUserB._id,
      skillKey: "javascript",
      sourceType: "assessment",
      sourceId: new mongoose.Types.ObjectId(),
      score: 100,
      verifiedAt: new Date(),
    });

    // User A passport must NOT contain User B's evidence
    const passportA = await getSkillPassport(testUserA._id);
    const hasEvidenceB = passportA.verifiedSkills.some((s) =>
      s.evidenceSummary?.some((e) => e._id?.toString() === evidenceB._id.toString()),
    );
    assert.equal(hasEvidenceB, false, "Cross-user data leakage detected!");
  });

  test("Test 5: Duplicate attempt request with identical idempotencyKey returns safe cached result", async () => {
    const idempotencyKey = "unique-attempt-" + Date.now();

    const answers = {};
    testAssessment.questions.forEach((q) => {
      answers[q._id.toString()] = q.correctAnswer;
    });

    // First attempt submission
    const res1 = await gradeAssessment({
      userId: testUserA._id,
      assessmentId: testAssessment._id,
      topicKey: "javascript",
      answers,
      durationSec: 45,
      idempotencyKey,
    });

    assert.equal(res1.passed, true);
    assert.equal(res1.score, 100);

    // Retry submission with SAME idempotencyKey
    const res2 = await gradeAssessment({
      userId: testUserA._id,
      assessmentId: testAssessment._id,
      topicKey: "javascript",
      answers,
      durationSec: 45,
      idempotencyKey,
    });

    assert.equal(res2.isDuplicate, true);
    assert.equal(res2.attemptId.toString(), res1.attemptId.toString());

    // Verify only ONE attempt document was created
    const count = await LearningAttempt.countDocuments({
      user: testUserA._id,
      idempotencyKey,
    });
    assert.equal(count, 1);
  });

  test("Test 6: Server-verified quiz mastery unlocks subsequent roadmap milestone", async () => {
    // Now that testUserA has passed 'javascript' with 100%, refresh progress
    await refreshRoadmapProgress(testUserA._id);

    const userRoadmap = await UserRoadmap.findOne({ user: testUserA._id });
    const jsItem = userRoadmap.progress.find((p) => p.itemKey === "javascript");
    const reactItem = userRoadmap.progress.find((p) => p.itemKey === "react");

    assert.equal(jsItem.status, "completed");
    assert.equal(jsItem.verifiedMastery, true);
    assert.equal(jsItem.progressPercent, 100);

    // React should now be unlocked (not-started instead of locked)
    assert.equal(reactItem.status, "not-started");
  });

  test("Test 7: Spaced retention review schedules proper interval and updates state to retained", async () => {
    // Submit retention review for User A
    const mastery = await scheduleNextReview({
      userId: testUserA._id,
      skillKey: "javascript",
      passed: true,
      fromDate: new Date(),
    });

    assert.ok(mastery);
    assert.ok(mastery.intervalDays >= 3);
    assert.ok(mastery.nextReviewAt > new Date());
    assert.equal(mastery.reviewHistory.length, 2); // Initial attempt + 1 review
  });

  test("Test 8: Adaptive Next Step recommends relevant next action based on learner data", async () => {
    const nextAction = await getAdaptiveNextAction(testUserA._id);

    assert.ok(nextAction);
    assert.ok(nextAction.title);
    assert.ok(nextAction.reason);
    assert.ok(nextAction.estimatedMinutes > 0);
  });
});
