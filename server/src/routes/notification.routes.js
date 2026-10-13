import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getNotifications,
  markAllRead,
  markAsRead,
} from "../controller/notification.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.patch("/read-all", authMiddleware, markAllRead);
router.patch("/:id/read", authMiddleware, markAsRead);

export default router;
