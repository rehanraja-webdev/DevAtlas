import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createProject,
  getMyProjects,
} from "../controller/project.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createProject);

router.get("/", authMiddleware, getMyProjects);

export default router;
