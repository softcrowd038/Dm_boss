// routes/debug.routes.js
import { Router } from "express";
import { auth } from "../middlewares/auth.js";
const router = Router();

router.get("/me", auth(), (req, res) => res.json({ success:true, user:req.user }));
export default router;

// and mount it:
router.use("/debug", debugRoutes);

// Call: GET /api/v1/debug/me with your Bearer token
