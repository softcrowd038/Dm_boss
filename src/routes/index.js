import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./users.routes.js";
import walletRoutes from "./wallet.routes.js";
import gamesRoutes from "./games.routes.js";
import marketsRoutes from "./markets.routes.js";
import docsRoutes from "./docs.routes.js";
import adminAuthRoutes from "./admin.auth.routes.js";
import adminMarketsRoutes from "./admin.markets.routes.js";
import adminRatesRoutes from "./admin.rates.routes.js";



const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/wallet", walletRoutes);
router.use("/games", gamesRoutes);
router.use("/markets", marketsRoutes);

// Swagger UI (visit http://localhost:5002/api/v1/docs)
router.use("/docs", docsRoutes);
router.use("/admin/auth", adminAuthRoutes);
router.use("/admin/markets", adminMarketsRoutes);
router.use("/admin/rates", adminRatesRoutes);

// router.use("/auth", authRoutes); router.use("/users", ...) etc.


export default router;
