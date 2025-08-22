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

// Public API routes
router.use("/auth", authRoutes);
router.use("/markets", marketsRoutes);
router.use("/docs", docsRoutes); // Swagger UI documentation

// Protected user routes (require authentication)
router.use("/users", userRoutes);
router.use("/wallet", walletRoutes);
router.use("/games", gamesRoutes);

// Admin routes (separate admin authentication)
router.use("/admin/auth", adminAuthRoutes);
router.use("/admin/markets", adminMarketsRoutes);
router.use("/admin/rates", adminRatesRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running successfully",
    timestamp: new Date().toISOString()
  });
});

// Fallback route for undefined endpoints
router.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

export default router;