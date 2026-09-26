import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import { startRoadmap } from "../controller/roadmap.controller";

const router = express.Router();

router.post("/:roadmapId/start", authMiddleware, startRoadmap);

export default router;
