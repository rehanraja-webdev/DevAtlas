import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getActivity } from "../controller/activity.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getActivity);

export default router;
