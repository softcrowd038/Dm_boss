import { Router } from "express";
import {
registerUser,
  loginUser,
  logout,
  getMe,
  verifyUser,
} from "../controllers/users.controller.js";
import { protect } from "../middlewares/protect.js";
import { validateRegistration } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// Auth routes
// Auth routes
router.post("/register", validateRegistration, asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.get("/logout", protect, asyncHandler(logout)); // Fixed: removed parentheses from protect
router.get("/me", protect, asyncHandler(getMe)); // Fixed: removed parentheses from protect
router.post("/verify", protect, asyncHandler(verifyUser)); // Fixed: removed parentheses from protect

export default router;