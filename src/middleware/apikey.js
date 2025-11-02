// src/middleware/apikey.js
module.exports = function requireApiKey(req, res, next) {
  const key = req.header('x-api-key') || req.query.api_key;
  if (!process.env.API_KEY) {
    console.warn('Warning: API_KEY not set in environment. Write endpoints are open.');
    return next();
  }
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  next();
};
