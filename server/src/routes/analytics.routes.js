import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getActivityAnalytics } from "../controller/analytics.controller.js";

const router = express.Router();

router.get("/activity", authMiddleware, getActivityAnalytics);

export default router;
