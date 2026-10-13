import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { talkToAaravi } from "../controller/englishPractice.controller.js";

const router = express.Router();

router.post("/chat", authMiddleware, talkToAaravi);

export default router;
