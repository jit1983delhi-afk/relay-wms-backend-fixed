const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      employee_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true, // made optional for non-staff logins (like admin)
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'warehouse', // default role for warehouse users
      },
      whid: {
        type: DataTypes.STRING,
        allowNull: true, // warehouse ID (BLR, BWDN, CHN, etc.)
      },
    },
    {
      tableName: 'users',
      timestamps: true,
    }
  );

  return User;
};
