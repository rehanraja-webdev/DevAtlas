import express from "express";
import authController from "../controller/auth.controller.js";
const router = express.Router();

router.post("/auth/register", authController.Register);

router.post("/auth/login", authController.Login);

export default router;
