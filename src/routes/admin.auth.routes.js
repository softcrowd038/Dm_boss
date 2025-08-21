import { Router } from "express";
import Joi from "joi";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { adminLogin } from "../controllers/adminAuth.controller.js";

const router = Router();

const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })
});

router.post("/login", validate(loginSchema), asyncHandler(adminLogin));

export default router;
