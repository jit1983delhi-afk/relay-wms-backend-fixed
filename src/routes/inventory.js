import express from "express";
import pool from "../db.js";

const router = express.Router();

// ✅ POST — Add Inventory Movement (IN / OUT)
router.post("/", async (req, res) => {
  try {
    const { product_id, movement_type, quantity, remarks } = req.body;

    if (!product_id || !movement_type || !quantity) {
      return res.status(400).json({ error: "product_id, movement_type, and quantity are required" });
    }

    await pool.query(
      `INSERT INTO relay_inventory (product_id, movement_type, quantity, remarks, createdat)
       VALUES ($1, $2, $3, $4, NOW())`,
      [product_id, movement_type.toUpperCase(), quantity, remarks || null]
    );

    res.json({ message: "✅ Inventory updated successfully" });
  } catch (error) {
    console.error("Error adding inventory record:", error);
    res.status(500).json({ error: "Server error while updating inventory" });
  }
});

// ✅ GET — Fetch All Inventory Movements
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id, 
        COALESCE(p.name, 'Unknown Product') AS product_name, 
        r.movement_type, 
        r.quantity, 
        r.remarks, 
        r.createdat
      FROM relay_inventory r
      LEFT JOIN products p ON CAST(p.id AS VARCHAR) = CAST(r.product_id AS VARCHAR)
      ORDER BY r.createdat DESC NULLS LAST
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching inventory:", error);
    res.status(500).json({ error: "Server error while fetching inventory" });
  }
});

// ✅ GET — Fetch Inventory by Product ID
router.get("/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;

    const result = await pool.query(
      `SELECT 
        r.id, 
        r.movement_type, 
        r.quantity, 
        r.remarks, 
        r.createdat
       FROM relay_inventory r
       WHERE CAST(r.product_id AS VARCHAR) = $1
       ORDER BY r.createdat DESC NULLS LAST`,
      [product_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching product inventory:", error);
    res.status(500).json({ error: "Server error while fetching product inventory" });
  }
});

export default router;
