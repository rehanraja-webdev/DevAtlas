import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getMyActivity } from "../controller/activity.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getMyActivity);

export default router;
