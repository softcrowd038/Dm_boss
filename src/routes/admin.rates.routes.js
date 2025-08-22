import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { upsertRatesSchema } from "../validators/admin.rates.validators.js";
import { getRates, upsertRates } from "../controllers/admin.rates.controller.js";

const router = Router();

// allow both admin & superadmin (so you don't get 403 while testing)
router.get("/", auth(["admin","superadmin"]), getRates);
router.post("/", auth(["admin","superadmin"]), validate(upsertRatesSchema), upsertRates);

export default router;
