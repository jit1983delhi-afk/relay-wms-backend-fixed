import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/products.js";
import inventoryRoutes from "./routes/inventory.js";
import stockRoutes from "./routes/stock.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes under /api prefix
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/stock", stockRoutes);

// Default fallback
app.get("/", (req, res) => {
  res.send("✅ Relay WMS backend is running!");
});

export default app;
