import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getProblems } from "../controller/dsa.controller.js";

const router = express.Router();

router.get("/problems", authMiddleware, getProblems);
export default router;
