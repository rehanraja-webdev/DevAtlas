import express from "express";
import authController from "../controller/auth.controller.js";
const router = express.Router();

router.post("/refresh", authController.refresh);

router.post("/auth/register", authController.Register);

router.post("/auth/login", authController.Login);

router.post("/auth/logout", authController.Logout);


export default router;
