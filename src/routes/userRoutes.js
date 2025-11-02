const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: '✅ User route working perfectly!' });
});

module.exports = router;
