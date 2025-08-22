import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import {
  adminLoginSchema,
  adminVerifyOtpSchema,
  adminResendOtpSchema
} from "../validators/admin.auth.validators.js";
import {
  adminLoginStart,
  adminVerifyOtp,
  adminResendOtp,
  adminLogout
} from "../controllers/admin.auth.controller.js";
import { adminLoginLimiter, adminVerifyLimiter } from "../middlewares/rateLimit.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/login",
  adminLoginLimiter,
  validate(adminLoginSchema),
  asyncHandler(adminLoginStart)
);

router.post("/verify-otp",
  adminVerifyLimiter,
  validate(adminVerifyOtpSchema),
  asyncHandler(adminVerifyOtp)
);

router.post("/resend-otp",
  adminVerifyLimiter,
  validate(adminResendOtpSchema),
  asyncHandler(adminResendOtp)
);

router.post("/logout", asyncHandler(adminLogout));

export default router;
