// src/models/product.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true, allowNull: false }, // barcode / SKU
    name: { type: DataTypes.STRING, allowNull: false },
    brand: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    mpn: { type: DataTypes.STRING },
    created_by: { type: DataTypes.STRING }
  }, {
    tableName: 'relay_products',
    timestamps: true
  });
  return Product;
};
