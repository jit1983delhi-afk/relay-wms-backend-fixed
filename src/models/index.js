import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import UserModel from "./User.js"; // 👈 must match exact file name (case-sensitive)

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL is not set. Please check your .env or Render environment variables.");
  process.exit(1);
}

// ✅ Initialize Sequelize
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

// ✅ Define Models
const User = UserModel(sequelize);

// ✅ Test Database Connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
})();

// ✅ Export Models & Connection
export { sequelize, User };
