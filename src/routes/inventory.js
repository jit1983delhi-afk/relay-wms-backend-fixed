// src/routes/inventory.js (updated to lookup product and create product_name if available)
const express = require('express');
const router = express.Router();
const requireApiKey = require('../middleware/apikey');
const { RelayInventory, Product } = require('../models');
const { Sequelize } = require('sequelize');

router.post('/', requireApiKey, async (req, res) => {
  try {
    const { product_code, product_name, movement_type, quantity, employee_id, timestamp, note } = req.body;
    if (!product_code || !movement_type || typeof quantity === 'undefined') {
      return res.status(400).json({ error: 'product_code, movement_type and quantity are required' });
    }
    // lookup product
    const prod = await Product.findOne({ where: { code: product_code } });
    const nameToSave = prod ? prod.name : (product_name || null);

    // If product not found and product_name provided, create product entry automatically
    if (!prod && product_name) {
      try {
        await Product.create({ code: product_code, name: product_name });
      } catch (e) {
        console.warn('Could not auto-create product:', e.message);
      }
    }

    const occurred_at = timestamp ? new Date(timestamp) : new Date();
    const rec = await RelayInventory.create({
      product_code: String(product_code),
      product_name: nameToSave,
      movement_type: movement_type.toUpperCase() === 'IN' ? 'IN' : 'OUT',
      quantity: Number(quantity),
      employee_id: employee_id || null,
      note: note || null,
      occurred_at
    });
    return res.status(201).json({ ok: true, id: rec.id });
  } catch (err) {
    console.error('POST /api/inventory error', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const limit = Math.min(200, Number(req.query.limit) || 100);
    const offset = Number(req.query.offset) || 0;
    const rows = await RelayInventory.findAll({
      order: [['occurred_at', 'DESC']],
      limit, offset
    });
    res.json(rows);
  } catch (err) {
    console.error('GET /api/inventory', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/inventory/summary?product_code=SKU123
router.get('/summary', async (req, res) => {
  try {
    const product_code = req.query.product_code;
    const where = product_code ? { product_code } : {};
    const totals = await RelayInventory.findAll({
      where,
      attributes: [
        'product_code',
        [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN movement_type='IN' THEN quantity ELSE -quantity END")), 'balance'],
        [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN movement_type='IN' THEN quantity ELSE 0 END")), 'total_in'],
        [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN movement_type='OUT' THEN quantity ELSE 0 END")), 'total_out']
      ],
      group: ['product_code'],
      order: [['product_code', 'ASC']],
      raw: true
    });
    res.json(totals);
  } catch (err) {
    console.error('GET /api/inventory/summary', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
