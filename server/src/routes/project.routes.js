import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createProject,
  deleteProject,
  getMyProject,
  getMyProjects,
  updateProject,
} from "../controller/project.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createProject);

router.get("/:projectId", authMiddleware, getMyProject);

router.get("/", authMiddleware, getMyProjects);

router.delete("/:projectId", authMiddleware, deleteProject);

router.patch("/:projectId", authMiddleware, updateProject);

export default router;
