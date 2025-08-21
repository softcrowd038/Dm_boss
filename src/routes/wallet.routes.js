import { Router } from "express";
import { addFunds, history } from "../controllers/wallet.controller.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { addFundsSchema } from "../validators/wallet.validators.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/add-funds", auth(), validate(addFundsSchema), asyncHandler(addFunds));
router.get("/history", auth(), asyncHandler(history));

export default router;
