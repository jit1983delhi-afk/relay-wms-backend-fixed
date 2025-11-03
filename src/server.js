import dotenv from "dotenv";
import express from "express";
dotenv.config();

const app = require('./app');
const PORT = process.env.PORT || 10000;

// Default route
app.get('/', (req, res) => {
  res.send('✅ Relay WMS Backend is running successfully!');
});

app.use("/api/products", require("./routes/products"));
app.use("/api/stock", require("./routes/stock"));
app.use("/api/inventory", require("./routes/inventory"));

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

import stockRoutes from "./routes/stock.js";
app.use("/api/stock", stockRoutes);

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
