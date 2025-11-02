const express = require("express");
const router = express.Router();
const { Sequelize, QueryTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
  logging: false
});

// ✅ GET — Current Stock Summary
router.get("/current", async (req, res) => {
  try {
    const results = await sequelize.query(`
      SELECT 
        product_code,
        product_name,
        SUM(CASE WHEN movement_type = 'IN' THEN quantity ELSE -quantity END) AS current_stock
      FROM relay_inventory
      GROUP BY product_code, product_name
      ORDER BY product_code;
    `, { type: QueryTypes.SELECT });

    res.json(results);
  } catch (error) {
    console.error("Error fetching stock summary:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
