import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import stockRoutes from "./routes/stock.js";
import productRoutes from "./routes/products.js";
import inventoryRoutes from "./routes/inventory.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/stock", stockRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);

// Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
