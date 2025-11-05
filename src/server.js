import app from "./app.js";
import dotenv from "dotenv";
import { sequelize } from "./models/index.js";

dotenv.config();

const PORT = process.env.PORT || 10000;

// ✅ Test database connection before starting server
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // Stop the server if DB connection fails
  }
})();
