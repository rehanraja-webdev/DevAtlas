import express from "express";
import { hello } from "../controller/test.controller";
const router = express.Router();

router.get("/hello", hello);

export default router;
