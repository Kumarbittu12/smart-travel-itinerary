import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "../db/index.js";

/**
 * @desc    Register a new user
 * @route   POST /api/register
 * @access  Public
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, contact_info, password, role } = req.body;

    // 1. Basic validation
    if (!name || !contact_info || !password) {
      return res.status(400).json({
        message: "Name, contact info and password are required"
      });
    }

    // 2. Check if user already exists
    const [existingUsers]: any = await db.query(
      "SELECT id FROM users WHERE contact_info = ?",
      [contact_info]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "User already registered"
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert user into DB
    await db.query(
      `INSERT INTO users (name, contact_info, password, role)
       VALUES (?, ?, ?, ?)`,
      [name, contact_info, hashedPassword, role || "Traveler"]
    );

    // 5. Response
    return res.status(201).json({
      message: "Registration successful"
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      message: "Server error during registration"
    });
  }
};
