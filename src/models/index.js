// src/models/index.js - initializes Sequelize and registers models
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const databaseUrl = process.env.DATABASE_URL || '';
if (!databaseUrl) {
  console.error('DATABASE_URL is not set. Set it in environment or .env');
}
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const User = require('./user')(sequelize, DataTypes);
const Product = require('./product')(sequelize, DataTypes);
const RelayInventory = require('./relay_inventory')(sequelize, DataTypes);

module.exports = {
  sequelize,
  Sequelize,
  User,
  Product,
  RelayInventory
};
