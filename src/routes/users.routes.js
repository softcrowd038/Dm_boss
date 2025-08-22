import { Router } from "express";
import {
  updateUser,
  changePassword,
  changePin,
  deleteUser,
  forgotPassword,
  resetPassword
} from "../controllers/userManagement.js";
import { protect } from "../middlewares/protect.js";
import {  validateUpdate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/forgot-password", asyncHandler(forgotPassword));
router.put("/reset-password", asyncHandler(resetPassword));

// User routes
router.put("/update", protect, validateUpdate, asyncHandler(updateUser)); // Fixed: removed parentheses from protect
router.put("/change-password", protect, asyncHandler(changePassword)); // Fixed: removed parentheses from protect
router.put("/change-pin", protect, asyncHandler(changePin)); // Fixed: removed parentheses from protect
router.delete("/delete", protect, asyncHandler(deleteUser)); // Fixed: removed parentheses from protect

export default router;