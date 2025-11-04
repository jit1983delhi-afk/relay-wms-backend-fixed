import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/products.js";
import inventoryRoutes from "../src/routes/inventory.js";
import stockRoutes from "../src/routes/stock.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// register routes
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/stock", stockRoutes);

export default app;
