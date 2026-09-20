import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getProfile, updateProfile } from "../controller/profile.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);

router.patch("/", authMiddleware, updateProfile);

export default router;
