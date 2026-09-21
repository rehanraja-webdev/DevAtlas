import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import { createSkill } from "../controller/skill.controller";

const router = new express.Router();

router.post("/", authMiddleware, createSkill);

export default router;
