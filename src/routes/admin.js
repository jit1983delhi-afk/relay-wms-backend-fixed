import express from "express";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";
import { getAllUsers } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", verifyToken, requireRole(["admin"]), getAllUsers);

export default router;
