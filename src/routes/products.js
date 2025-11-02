// src/routes/products.js
const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const { Op } = require('sequelize');

// GET /api/products - list products (with optional ?q= search)
router.get('/', async (req, res) => {
  try {
    const q = req.query.q || null;
    const where = q ? { [Op.or]: [
      { code: { [Op.iLike]: `%${q}%` } },
      { name: { [Op.iLike]: `%${q}%` } }
    ] } : {};
    const products = await Product.findAll({ where, limit: 200, order: [['name','ASC']] });
    res.json(products);
  } catch (err) {
    console.error('GET /api/products', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/lookup?code=SKU123
router.get('/lookup', async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).json({ error: 'code required' });
    const product = await Product.findOne({ where: { code } });
    if (!product) return res.status(404).json({ error: 'not found' });
    res.json(product);
  } catch (err) {
    console.error('GET /api/products/lookup', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/products - create new product
router.post('/', async (req, res) => {
  try {
    const { code, name, brand, category, mpn, created_by } = req.body;
    if (!code || !name) return res.status(400).json({ error: 'code and name required' });
    const [product, created] = await Product.findOrCreate({
      where: { code },
      defaults: { name, brand, category, mpn, created_by }
    });
    res.status(created ? 201 : 200).json(product);
  } catch (err) {
    console.error('POST /api/products', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
