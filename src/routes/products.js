const express = require("express");
const router = express.Router();

// Mock product lookup API
// Example: /api/products/lookup?code=SKU123
router.get("/lookup", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: "Missing product code" });

    // For demo - replace this with DB query later
    const mockProduct = {
      code,
      name: "Sample Product",
      category: "General",
      brand: "Relay",
      price: 100,
    };

    res.json({ message: "✅ Product lookup successful", data: mockProduct });
  } catch (error) {
    console.error("Product lookup failed:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
