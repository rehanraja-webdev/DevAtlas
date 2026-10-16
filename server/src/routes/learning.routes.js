import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getLessons,
  getLesson,
  getQuiz,
  getAssessment,
  submitAssessmentAttempt,
  submitQuizAttempt,
  submitExercise,
  getAdaptiveNext,
  getMasteryMe,
  getReviewQueue,
  submitReview,
  getSkillPassportData,
  getSprint,
  getUserAttempts,
  getLearningAnalytics,
} from "../controller/learning.controller.js";

const router = express.Router();

// All learning endpoints require authentication
router.use(authMiddleware);

// Adaptive Next Best Action & Weekly Sprint (Feature B)
router.get("/next", getAdaptiveNext);
router.get("/sprint", getSprint);

// Evidence-backed Skill Graph & Skill Passport (Feature A)
router.get("/mastery/me", getMasteryMe);
router.get("/skill-passport", getSkillPassportData);

// Spaced Repetition Review Queue (Feature D)
router.get("/review-queue", getReviewQueue);
router.post("/reviews/:skillKey/attempts", submitReview);

// Lessons
router.get("/lessons", getLessons);
router.get("/lessons/:id", getLesson);

// Assessments & Quizzes (Server-graded, anti-cheat)
router.get("/assessments/:id", getAssessment);
router.post("/assessments/:id/attempts", submitAssessmentAttempt);
router.get("/quizzes/:id", getQuiz);
router.post("/quizzes/:id/attempts", submitQuizAttempt);
router.get("/quizzes/:id/attempts", getUserAttempts);

// Exercises
router.post("/exercises/:id/submissions", submitExercise);

// General Attempts & Analytics
router.get("/attempts", getUserAttempts);
router.get("/analytics", getLearningAnalytics);

export default router;
