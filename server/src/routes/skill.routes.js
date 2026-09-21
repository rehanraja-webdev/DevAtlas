import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createSkill, getSkills } from "../controller/skill.controller.js";

const router = new express.Router();

router.post("/", authMiddleware, createSkill);

router.get("/", authMiddleware, getSkills);
export default router;
