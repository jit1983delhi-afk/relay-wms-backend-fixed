require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    await sequelize.sync();

    const employee_id = process.env.CREATE_ADMIN_EMPLOYEE_ID || 'R3PL-TWBP-2033';
    const password = process.env.CREATE_ADMIN_PASSWORD || '987654321';

    const existing = await User.findOne({ where: { employee_id } });
    if (existing) {
      console.log('Admin user already exists:', employee_id);
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ employee_id, full_name: 'Admin User', password_hash: hash, role: 'admin' });
    console.log('Admin user created:', user.employee_id);
    process.exit(0);
  } catch (err) {
    console.error('Create admin failed:', err);
    process.exit(1);
  }
})();
