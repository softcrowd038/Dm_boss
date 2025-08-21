import { Router } from "express";
import { me } from "../controllers/users.controller.js";
import { auth } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.get("/me", auth(), asyncHandler(me));

export default router;
