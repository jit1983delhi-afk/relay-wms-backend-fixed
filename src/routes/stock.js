import express from "express";
import pool from "../db.js";


const router = express.Router();

// ✅ 1. Add Stock (IN)
router.post("/in", async (req, res) => {
  try {
    const { product_id, quantity, remarks } = req.body;
    if (!product_id || !quantity) {
      return res.status(400).json({ error: "product_id and quantity are required" });
    }

    await pool.query(
      `INSERT INTO relay_inventory (product_id, movement_type, quantity, remarks)
       VALUES ($1, 'IN', $2, $3)`,
      [product_id, quantity, remarks || null]
    );

    res.json({ message: "Stock added successfully ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while adding stock" });
  }
});

// ✅ 2. Remove Stock (OUT)
router.post("/out", async (req, res) => {
  try {
    const { product_id, quantity, remarks } = req.body;
    if (!product_id || !quantity) {
      return res.status(400).json({ error: "product_id and quantity are required" });
    }

    await pool.query(
      `INSERT INTO relay_inventory (product_id, movement_type, quantity, remarks)
       VALUES ($1, 'OUT', $2, $3)`,
      [product_id, quantity, remarks || null]
    );

    res.json({ message: "Stock deducted successfully ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while removing stock" });
  }
});

// ✅ 3. Live Stock Summary
router.get("/summary", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.name,
        COALESCE(SUM(CASE WHEN r.movement_type = 'IN' THEN r.quantity ELSE 0 END), 0)
        - COALESCE(SUM(CASE WHEN r.movement_type = 'OUT' THEN r.quantity ELSE 0 END), 0) AS current_stock
      FROM products p
      LEFT JOIN relay_inventory r ON p.id = r.product_id
      GROUP BY p.id, p.name
      ORDER BY p.id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching stock summary" });
  }
});

export default router;
