import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js"; // make sure models/index.js exports User

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ Register a new user
export const register = async (req, res) => {
  try {
    const { full_name, email, password, role, whid } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
      role: role || "warehouse",
      whid: whid || null,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        whid: newUser.whid,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// ✅ Login existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, whid: user.whid },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        whid: user.whid,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};
