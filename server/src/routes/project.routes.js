import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createProject } from "../controller/project.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createProject);

export default router;
