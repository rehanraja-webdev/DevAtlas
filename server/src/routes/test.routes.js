import express from "express";
import { hello } from "../controller/test.controller.js";
const router = express.Router();

router.get("/hello", hello);

export default router;
