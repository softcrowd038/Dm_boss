import { Router } from "express";
import { listMarkets, getPublicRates } from "../controllers/markets.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/list", asyncHandler(listMarkets));
router.get("/rates", getPublicRates);

export default router;
