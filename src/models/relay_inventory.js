// src/models/relay_inventory.js (updated to export same as before)
module.exports = (sequelize, DataTypes) => {
  const RelayInventory = sequelize.define('RelayInventory', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    product_code: { type: DataTypes.STRING, allowNull: false },
    product_name: { type: DataTypes.STRING, allowNull: true },
    movement_type: { type: DataTypes.ENUM('IN','OUT'), allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    employee_id: { type: DataTypes.STRING, allowNull: true },
    note: { type: DataTypes.TEXT, allowNull: true },
    occurred_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'relay_inventory',
    timestamps: true
  });
  return RelayInventory;
};
