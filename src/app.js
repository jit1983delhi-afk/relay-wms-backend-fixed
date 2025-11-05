import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// ✅ Route Imports
import productRoutes from "./routes/products.js";
import inventoryRoutes from "./routes/inventory.js";
import stockRoutes from "./routes/stock.js";
import authRoutes from "./routes/auth.js";       // ✅ Authentication (Login/Register)
import adminRoutes from "./routes/admin.js";     // ✅ Admin-only routes

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Mount API Routes
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/auth", authRoutes);       // ⬅️ Added authentication
app.use("/api/admin", adminRoutes);     // ⬅️ Added admin access routes

// ✅ Health Check Endpoint
app.get("/", (req, res) => {
  res.send("✅ Relay WMS Backend is running and connected to Render!");
});

// ✅ 404 Fallback (if route not found)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
