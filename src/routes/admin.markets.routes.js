// src/routes/admin.markets.routes.js
import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import * as ctl from "../controllers/admin.markets.controller.js";

const router = Router();

router.post("/",   auth(["superadmin","admin"]), ctl.createMarket);
router.get("/",    auth(["superadmin","admin"]), ctl.listMarkets);
router.put("/:id", auth(["superadmin","admin"]), ctl.updateMarket);
router.delete("/:id", auth(["superadmin","admin"]), ctl.deleteMarket);
router.patch("/:id/active", auth(["superadmin","admin"]), ctl.patchActive);


export default router;
