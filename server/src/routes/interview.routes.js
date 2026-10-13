import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  analyzeResume,
  getHistory,
  getSession,
  interactInRound,
  startInterview,
  submitAnswer,
} from "../controller/interview.controller.js";

const router = express.Router();

router.post("/analyze-resume", authMiddleware, analyzeResume);
router.post("/start", authMiddleware, startInterview);
router.post("/interact", authMiddleware, interactInRound);
router.post("/answer", authMiddleware, submitAnswer);
router.get("/sessions/:sessionId", authMiddleware, getSession);
router.get("/history", authMiddleware, getHistory);

export default router;
