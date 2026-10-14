import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getLessons,
  getLesson,
  getQuiz,
  submitQuizAttempt,
  submitExercise,
  getUserAttempts,
  getLearningAnalytics,
} from "../controller/learning.controller.js";

const router = express.Router();

// All learning endpoints require authentication
router.use(authMiddleware);

// Lessons
router.get("/lessons", getLessons);
router.get("/lessons/:id", getLesson);

// Quizzes
router.get("/quizzes/:id", getQuiz);
router.post("/quizzes/:id/attempts", submitQuizAttempt);
router.get("/quizzes/:id/attempts", getUserAttempts);

// Exercises
router.post("/exercises/:id/submissions", submitExercise);

// General Attempts & Analytics
router.get("/attempts", getUserAttempts);
router.get("/analytics", getLearningAnalytics);

export default router;
