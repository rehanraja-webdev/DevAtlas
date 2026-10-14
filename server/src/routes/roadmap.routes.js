import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getMyRoadmap,
  getRoadmap,
  getRoadmaps,
  startRoadmap,
  updateRoadmapProgress,
} from "../controller/roadmap.controller.js";

const router = express.Router();

// List all available roadmaps
router.get("/", authMiddleware, getRoadmaps);

// Specific literal routes MUST precede parameterized routes (/:roadmapId)
router.get("/my-roadmap", authMiddleware, getMyRoadmap);

router.patch(
  "/my-roadmap/items/:itemKey",
  authMiddleware,
  updateRoadmapProgress,
);

// Parameterized roadmap routes
router.post("/:roadmapId/start", authMiddleware, startRoadmap);

router.get("/:roadmapId", authMiddleware, getRoadmap);

export default router;
