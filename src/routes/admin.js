import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { getAdminDashboard } from "../controllers/adminController.js";

const router = express.Router();

// ✅ Protected admin-only route
router.get("/dashboard", verifyToken, isAdmin, getAdminDashboard);

export default router;
