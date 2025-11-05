// src/routes/admin.js
import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { getAdminDashboard } from "../controllers/adminController.js";

// If you have an auth middleware that sets req.user & checks admin role:
// import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Use your real auth middleware here; for now, simple placeholder:
const requireAdmin = (req, res, next) => {
  // If you already have JWT middleware, mount it here instead.
  if (req.user && req.user.role === "admin") return next();
  // If you don't yet have JWT middleware, allow for local testing:
  // remove the next line when using real auth
  // return next(); // <--- only for local testing (NOT for prod)
  return res.status(403).json({ error: "Admin access required" });
};

// ✅ Protected route – only logged-in admins can access
router.get("/dashboard", requireAdmin, getAdminDashboard);

export default router;
