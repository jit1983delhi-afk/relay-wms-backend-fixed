// src/routes/stock.js -> provides /api/stock/current and /api/stock/:code
const express = require('express');
const router = express.Router();
const { RelayInventory } = require('../models');
const { Sequelize } = require('sequelize');

// GET /api/stock/current -> list balances for all SKUs
router.get('/current', async (req, res) => {
  try {
    const totals = await RelayInventory.findAll({
      attributes: [
        'product_code',
        [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN movement_type='IN' THEN quantity ELSE -quantity END")), 'balance'],
        [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN movement_type='IN' THEN quantity ELSE 0 END")), 'total_in'],
        [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN movement_type='OUT' THEN quantity ELSE 0 END")), 'total_out']
      ],
      group: ['product_code'],
      order: [['product_code','ASC']],
      raw: true
    });
    res.json(totals);
  } catch (err) {
    console.error('GET /api/stock/current', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/stock/:code -> balance for single SKU
router.get('/:code', async (req, res) => {
  try {
    const code = req.params.code;
    const totals = await RelayInventory.findAll({
      where: { product_code: code },
      attributes: [
        'product_code',
        [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN movement_type='IN' THEN quantity ELSE -quantity END")), 'balance'],
        [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN movement_type='IN' THEN quantity ELSE 0 END")), 'total_in'],
        [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN movement_type='OUT' THEN quantity ELSE 0 END")), 'total_out']
      ],
      group: ['product_code'],
      raw: true
    });
    res.json(totals[0] || { product_code: code, balance: 0, total_in: 0, total_out: 0 });
  } catch (err) {
    console.error('GET /api/stock/:code', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
