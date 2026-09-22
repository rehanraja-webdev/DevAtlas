import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createSkill,
  getSkills,
  updateSkill,
} from "../controller/skill.controller.js";

const router = new express.Router();

router.post("/", authMiddleware, createSkill);

router.get("/", authMiddleware, getSkills);

router.patch("/:id", authMiddleware, updateSkill);

export default router;
