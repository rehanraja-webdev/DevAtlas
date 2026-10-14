import {
  getLessonsService,
  getLessonDetailsService,
  getQuizService,
  submitQuizAttemptService,
  submitExerciseService,
  getUserAttemptsService,
  getLearningAnalyticsService,
} from "../services/learning.service.js";

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
    const lesson = await getLessonDetailsService(req.params.id);

    return res.status(200).json({
      success: true,
      data: {
        lesson,
      },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message || "Lesson not found",
    });
  }
};

export const getQuiz = async (req, res) => {
  try {
    const quiz = await getQuizService(req.params.id);

    return res.status(200).json({
      success: true,
      data: {
        quiz,
      },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message || "Quiz not found",
    });
  }
};

export const submitQuizAttempt = async (req, res) => {
  try {
    const { answers, durationSec } = req.body;
    const result = await submitQuizAttemptService(
      req.user.userId,
      req.params.id,
      answers,
      durationSec,
    );

    return res.status(200).json({
      success: true,
      message: result.passed
        ? "Mastery verified! Milestone completed."
        : "Assessment evaluated. Passing score not reached.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
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

export const getUserAttempts = async (req, res) => {
  try {
    const { topicKey, quizId, type } = req.query;
    const attempts = await getUserAttemptsService(req.user.userId, {
      topicKey,
      quizId,
      type,
    });

    return res.status(200).json({
      success: true,
      data: {
        attempts,
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
