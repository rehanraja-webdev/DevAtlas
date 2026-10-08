import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { requestReport } from "../controller/report.controller.js";

const router = express.Router();

router.post("/generate", authMiddleware, requestReport);

export default router;
