import { Router } from "express";
import { listMarkets, getRates } from "../controllers/markets.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/list", asyncHandler(listMarkets));
router.get("/rates", asyncHandler(getRates));

export default router;
