import { Router } from "express";
import { placeBet, myBets } from "../controllers/games.controller.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { placeBetSchema } from "../validators/games.validators.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/place", auth(), validate(placeBetSchema), asyncHandler(placeBet));
router.get("/my", auth(), asyncHandler(myBets));

export default router;
