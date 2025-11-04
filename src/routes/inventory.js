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
      `INSERT INTO relay_inventory (product_id, movement_type, quantity, remarks)
       VALUES ($1, $2, $3, $4)`,
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
      SELECT r.id, p.name AS product_name, r.movement_type, r.quantity, r.remarks, r.created_at
      FROM relay_inventory r
      LEFT JOIN products p ON p.id = r.product_id
      ORDER BY r.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    res.status(500).json({ error: "Server error while fetching inventory" });
  }
});

// ✅ GET — Fetch Inventory by Product ID
router.get("/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;
    const result = await pool.query(
      `SELECT id, movement_type, quantity, remarks, created_at
       FROM relay_inventory
       WHERE product_id = $1
       ORDER BY created_at DESC`,
      [product_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching product inventory:", error);
    res.status(500).json({ error: "Server error while fetching product inventory" });
  }
});

export default router;
