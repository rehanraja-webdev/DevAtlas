import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getMyRoadmap,
  getRoadmaps,
  startRoadmap,
  updateRoadmapProgress,
} from "../controller/roadmap.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getRoadmaps);

router.post("/:roadmapId/start", authMiddleware, startRoadmap);

router.get("/my-roadmap", authMiddleware, getMyRoadmap);

router.patch(
  "/my-roadmap/items/:itemKey",
  authMiddleware,
  updateRoadmapProgress,
);

export default router;
