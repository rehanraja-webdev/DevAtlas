import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  askAiMentor,
  getAiGuidance,
  getLatestReport,
  getReportHistory,
  requestReport,
} from "../controller/report.controller.js";

const router = express.Router();

router.post("/generate", authMiddleware, requestReport);
router.get("/latest", authMiddleware, getLatestReport);
router.get("/history", authMiddleware, getReportHistory);
router.get("/guidance", authMiddleware, getAiGuidance);
router.post("/mentor-chat", authMiddleware, askAiMentor);

export default router;
