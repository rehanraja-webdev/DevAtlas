import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createProject,
  deleteProject,
  getMyProjects,
} from "../controller/project.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createProject);

router.get("/", authMiddleware, getMyProjects);

router.delete("/:projectId", authMiddleware, deleteProject);

//TODO:
// PATCH  /api/v1/projects/:id
// GET    /api/v1/projects/:id

export default router;
