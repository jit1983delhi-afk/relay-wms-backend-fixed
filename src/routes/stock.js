const express = require("express");
const router = express.Router();

// Mock stock data - later replace with DB integration
router.get("/current", async (req, res) => {
  try {
    const stock = [
      { product_code: "SKU001", product_name: "Relay Pad 10", qty: 150 },
      { product_code: "SKU002", product_name: "Relay Phone 9", qty: 85 },
      { product_code: "SKU003", product_name: "Relay Charger", qty: 300 },
    ];

    res.json({ message: "✅ Current stock fetched successfully", data: stock });
  } catch (error) {
    console.error("Stock fetch failed:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
