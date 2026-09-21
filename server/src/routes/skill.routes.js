import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createSkill } from "../controller/skill.controller.js";

const router = new express.Router();

router.post("/", authMiddleware, createSkill);

export default router;
