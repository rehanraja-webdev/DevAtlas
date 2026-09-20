import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import authController from "../controller/auth.controller.js";
const router = express.Router();

router.post("/refresh", authController.refresh);

router.post("/auth/register", authController.Register);

router.post("/auth/login", authController.Login);

router.get("/auth/me", authMiddleware, authController.getMe);

router.post("/auth/logout", authController.Logout);

router.post("/auth/logout-all", authMiddleware, authController.LogoutAll);

export default router;
