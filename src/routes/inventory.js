const express = require("express");
const router = express.Router();
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Connect to Render PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
  logging: false
});

// Define relay_inventory model
const Inventory = sequelize.define("relay_inventory", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_code: { type: DataTypes.STRING, allowNull: false },
  product_name: { type: DataTypes.STRING },
  movement_type: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, {
  tableName: "relay_inventory",
  timestamps: false
});

// ✅ POST — Add new inventory entry (Stock IN/OUT)
router.post("/", async (req, res) => {
  try {
    const { product_code, product_name, movement_type, quantity } = req.body;

    if (!product_code || !movement_type || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const entry = await Inventory.create({
      product_code,
      product_name,
      movement_type,
      quantity
    });

    res.status(201).json({ message: "Entry added successfully", entry });
  } catch (error) {
    console.error("Error adding inventory entry:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
