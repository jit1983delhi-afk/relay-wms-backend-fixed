import dotenv from "dotenv";
import app from "./src/app.js"; // ✅ OK if app.js inside src
import { sequelize } from "./src/models/index.js"; // ✅ OK if index.js inside src/models

dotenv.config();

const PORT = process.env.PORT || 10000;

// ✅ Test database connection before starting server
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log("🌐 Relay WMS Backend is running and connected to Render!");
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // Stop the server if DB connection fails
  }
})();
