const { Sequelize } = require('sequelize');

const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl) {
  console.error('DATABASE_URL is not set. Set it in environment or .env');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});


const User = require('./user')(sequelize);

module.exports = {
  sequelize,
  User,
};
