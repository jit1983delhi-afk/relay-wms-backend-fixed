import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import UserModel from "./User.js"; // make sure this file uses ESM exports

dotenv.config();

// ✅ Load database URL
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL is not set. Please check your .env or Render environment variables.");
  process.exit(1);
}

// ✅ Initialize Sequelize connection
const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // required for Render PostgreSQL SSL
    },
  },
});

// ✅ Initialize Models
const User = UserModel(sequelize);

// ✅ Test DB connection (optional, good for debugging)
try {
  await sequelize.authenticate();
  console.log("✅ Database connected successfully!");
} catch (err) {
  console.error("❌ Database connection failed:", err.message);
}

// ✅ Export models and sequelize instance
export { sequelize, User };
