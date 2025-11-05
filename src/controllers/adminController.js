// src/controllers/adminController.js
import { User } from "../models/index.js"; // ESM import, matches your models export

export const getAdminDashboard = async (req, res) => {
  try {
    // simple example metrics
    const totalUsers = await User.count();
    const admins = await User.count({ where: { role: "admin" } });

    res.status(200).json({
      message: "Admin dashboard",
      admin: req.user ? req.user.email : null,
      totals: {
        totalUsers,
        admins,
      },
    });
  } catch (err) {
    console.error("Error in Admin Dashboard:", err);
    res.status(500).json({ error: "Server error in admin dashboard" });
  }
};
