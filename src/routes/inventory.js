const express = require("express");
const router = express.Router();

// POST /api/inventory
// Body: { "product_code": "SKU001", "type": "IN", "qty": 50 }
router.post("/", async (req, res) => {
  try {
    const { product_code, type, qty } = req.body;

    if (!product_code || !type || !qty)
      return res.status(400).json({ error: "Missing fields" });

    // For demo - later connect with Postgres table "relay_inventory"
    console.log(`📦 Inventory ${type} for ${product_code}: ${qty}`);

    res.json({
      message: `✅ Inventory ${type === "IN" ? "added" : "deducted"} successfully`,
      data: { product_code, type, qty },
    });
  } catch (error) {
    console.error("Inventory update failed:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
