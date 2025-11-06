import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import UserModel from "./User.js"; // ✅ RELATIVE PATH (no /src)

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

// ✅ Initialize models
const User = UserModel(sequelize);

// ✅ Export initialized Sequelize instance and models
export { sequelize, User };
