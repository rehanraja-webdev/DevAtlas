import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getDSAProgress,
  getProblems,
  updateDSAProgress,
} from "../controller/dsa.controller.js";

const router = express.Router();

router.get("/problems", authMiddleware, getProblems);

router.post("/problems/:problemId/progress", authMiddleware, updateDSAProgress);

router.get("/my-progress", authMiddleware, getDSAProgress);

export default router;
