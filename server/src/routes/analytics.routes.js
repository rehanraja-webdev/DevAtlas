import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getActivityAnalytics, getDeveloperOverview } from "../controller/analytics.controller.js";

const router = express.Router();

router.get("/activity", authMiddleware, getActivityAnalytics);

router.get("/overview", authMiddleware, getDeveloperOverview);

export default router;
