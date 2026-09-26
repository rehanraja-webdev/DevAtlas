import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import { getMyRoadmap, startRoadmap } from "../controller/roadmap.controller";

const router = express.Router();

router.post("/:roadmapId/start", authMiddleware, startRoadmap);

router.get("/my-roadmap", authMiddleware, getMyRoadmap);

export default router;
