import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import User from './User.js';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL is not set. Please check your .env or Render environment variables.");
  process.exit(1);
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const User = UserModel(sequelize);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
})();

export { sequelize, User };
