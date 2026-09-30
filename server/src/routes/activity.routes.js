import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getMyActivity } from "../controller/activity.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getMyActivity);

export default router;
//TODO:
// 3. Create activity when:
  //  - DSA attempted
  //  - DSA solved
  //  - Roadmap started
  //  - Skill added/updated