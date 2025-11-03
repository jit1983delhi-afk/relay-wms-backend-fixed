const express = require("express");
const router = express.Router();
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  logging: false
});

// Inventory Table
const Inventory = sequelize.define("relay_inventory", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_code: { type: DataTypes.STRING, allowNull: false },
  product_name: { type: DataTypes.STRING },
  movement_type: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { tableName: "relay_inventory", timestamps: false });

// Products Table (for barcode lookup)
const Product = sequelize.define("products", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_code: { type: DataTypes.STRING, allowNull: false },
  product_name: { type: DataTypes.STRING, allowNull: false }
}, { tableName: "products", timestamps: false });

// ✅ POST — Manual or Barcode-Based Stock IN/OUT Entry
router.post("/", async (req, res) => {
  try {
    let { product_code, movement_type, quantity, product_name } = req.body;

    if (!product_code || !movement_type || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Try to auto-fetch product name if not given
    if (!product_name) {
      const found = await Product.findOne({ where: { product_code } });
      if (found) product_name = found.product_name;
      else product_name = "Unknown Item";
    }

    const entry = await Inventory.create({
      product_code,
      product_name,
      movement_type,
      quantity
    });

    res.status(201).json({
      message: "✅ Inventory updated successfully",
      entry
    });
  } catch (error) {
    console.error("Error in inventory entry:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET — Scan Barcode for Product Info
router.get("/scan/:barcode", async (req, res) => {
  try {
    const code = req.params.barcode;
    const found = await Product.findOne({ where: { product_code: code } });

    if (found) {
      res.json({
        success: true,
        message: "✅ Product found",
        product: found
      });
    } else {
      res.status(404).json({ success: false, message: "❌ Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
