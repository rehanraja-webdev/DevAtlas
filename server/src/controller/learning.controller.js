import mongoose from "mongoose";
import {
  getLessonsService,
  getLessonDetailsService,
  getQuizService,
  submitQuizAttemptService,
  submitExerciseService,
  getUserAttemptsService,
  getLearningAnalyticsService,
} from "../services/learning.service.js";
import {
  gradeAssessment,
  getAdaptiveNextAction,
  getDueReviews,
  scheduleNextReview,
  getSkillPassport,
  buildWeeklySprint,
} from "../services/learningProgress.service.js";
import Assessment from "../models/Assessment.js";
import SkillMastery from "../models/SkillMastery.js";
import LearningAttempt from "../models/LearningAttempt.js";
import Lesson from "../models/Lesson.js";
import Attempt from "../models/Attempt.js";

export const getLessons = async (req, res) => {
  try {
    const { topicKey } = req.query;
    const lessons = await getLessonsService({ topicKey });

    return res.status(200).json({
      success: true,
      data: {
        lessons,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve lessons",
    });
  }
};

export const getLesson = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const lesson = await getLessonDetailsService(req.params.id, userId);

    return res.status(200).json({
      success: true,
      data: {
        lesson,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 404;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Lesson not found",
    });
  }
};

export const getQuiz = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const quiz = await getQuizService(req.params.id, userId);

    return res.status(200).json({
      success: true,
      data: {
        quiz,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 404;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Quiz not found",
    });
  }
};

export const getAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { topicKey: id, status: "published" };
    }

    // STRICT ANTI-CHEAT: Never leak correctAnswer or hidden test data
    const assessment = await Assessment.findOne(query)
      .sort({ version: -1 })
      .select("-questions.correctAnswer -questions.explanation");

    if (!assessment) {
      // Fallback to quiz
      const fallbackQuiz = await getQuizService(id, userId);
      return res.status(200).json({
        success: true,
        data: {
          assessment: fallbackQuiz,
        },
      });
    }

    // If assessment is linked to a lesson with dependencies, enforce prerequisite gate
    if (userId && assessment.lessonId) {
      const lesson = await Lesson.findById(assessment.lessonId);
      if (lesson?.dependencies?.length > 0) {
        const passedAttempts = await LearningAttempt.find({
          user: userId,
          topicKey: { $in: lesson.dependencies },
          passed: true,
        }).select("topicKey");

        const passedKeys = new Set(passedAttempts.map((a) => a.topicKey));
        const missing = lesson.dependencies.filter((dep) => !passedKeys.has(dep));

        if (missing.length > 0) {
          return res.status(403).json({
            success: false,
            message: `Prerequisites required: You must achieve verified mastery on [${missing.join(
              ", ",
            )}] before attempting this assessment.`,
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        assessment,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 404;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Assessment not found",
    });
  }
};

export const submitAssessmentAttempt = async (req, res) => {
  try {
    const { answers, durationSec, idempotencyKey, topicKey } = req.body;
    const assessmentId = req.params.id;

    const result = await gradeAssessment({
      userId: req.user.userId,
      assessmentId,
      topicKey,
      answers,
      durationSec,
      idempotencyKey,
    });

    return res.status(200).json({
      success: true,
      message: result.passed
        ? "Mastery verified! Milestone completed."
        : "Assessment evaluated. Passing threshold (80%) not reached.",
      data: result,
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to submit assessment attempt",
    });
  }
};

export const submitQuizAttempt = async (req, res) => {
  try {
    const { answers, durationSec, idempotencyKey } = req.body;

    const result = await gradeAssessment({
      userId: req.user.userId,
      assessmentId: req.params.id,
      answers,
      durationSec,
      idempotencyKey,
    });

    return res.status(200).json({
      success: true,
      message: result.passed
        ? "Mastery verified! Milestone completed."
        : "Assessment evaluated. Passing score not reached.",
      data: result,
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to submit quiz attempt",
    });
  }
};

export const submitExercise = async (req, res) => {
  try {
    const { code, durationSec } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Source code is required for exercise submission",
      });
    }

    const result = await submitExerciseService(
      req.user.userId,
      req.params.id,
      code,
      durationSec,
    );

    return res.status(200).json({
      success: true,
      message: result.passed
        ? "All tests passed successfully!"
        : "Some test cases failed.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to evaluate exercise submission",
    });
  }
};

export const getAdaptiveNext = async (req, res) => {
  try {
    const nextAction = await getAdaptiveNextAction(req.user.userId);
    return res.status(200).json({
      success: true,
      data: {
        nextAction,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to determine next adaptive action",
    });
  }
};

export const getMasteryMe = async (req, res) => {
  try {
    // Owner identity scoped strictly from authenticated req.user.userId (IDOR protection)
    const masteries = await SkillMastery.find({ user: req.user.userId }).populate({
      path: "evidence",
      select: "sourceType score verifiedAt contentVersion notes",
    });

    return res.status(200).json({
      success: true,
      data: {
        masteries,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch skill mastery states",
    });
  }
};

export const getReviewQueue = async (req, res) => {
  try {
    const dueReviews = await getDueReviews(req.user.userId);

    return res.status(200).json({
      success: true,
      data: {
        dueReviews,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch spaced review queue",
    });
  }
};

export const submitReview = async (req, res) => {
  try {
    const { skillKey } = req.params;
    const { passed, score } = req.body;

    const mastery = await scheduleNextReview({
      userId: req.user.userId,
      skillKey,
      passed: Boolean(passed),
      fromDate: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: passed
        ? "Retention review passed! Next interval scheduled."
        : "Retention review flagged for follow-up remediation.",
      data: {
        mastery,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to submit retention review",
    });
  }
};

export const getSkillPassportData = async (req, res) => {
  try {
    const passport = await getSkillPassport(req.user.userId);

    return res.status(200).json({
      success: true,
      data: {
        passport,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate skill passport",
    });
  }
};

export const getSprint = async (req, res) => {
  try {
    const sprint = await buildWeeklySprint(req.user.userId);

    return res.status(200).json({
      success: true,
      data: {
        sprint,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate weekly sprint",
    });
  }
};

export const getUserAttempts = async (req, res) => {
  try {
    const { topicKey, quizId, type } = req.query;

    // First try LearningAttempt
    const query = { user: req.user.userId };
    if (topicKey) query.topicKey = topicKey;
    if (type) query.type = type;

    const attempts = await LearningAttempt.find(query)
      .select("topicKey type score passed durationSec feedback createdAt")
      .sort({ createdAt: -1 })
      .limit(20);

    if (attempts.length > 0) {
      return res.status(200).json({
        success: true,
        data: {
          attempts,
        },
      });
    }

    // Fallback to legacy Attempt records
    const legacyAttempts = await getUserAttemptsService(req.user.userId, {
      topicKey,
      quizId,
      type,
    });

    return res.status(200).json({
      success: true,
      data: {
        attempts: legacyAttempts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch attempt history",
    });
  }
};

export const getLearningAnalytics = async (req, res) => {
  try {
    const analytics = await getLearningAnalyticsService(req.user.userId);

    return res.status(200).json({
      success: true,
      data: {
        analytics,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch learning analytics",
    });
  }
};
