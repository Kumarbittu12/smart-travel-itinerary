import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import db from "../db/index.js";
import bcrypt from "bcrypt";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { contact_info, password } = req.body;

    if (!contact_info || !password) {
      return res.status(400).json({
        message: "Contact info and password are required"
      });
    }

    const [users]: any = await db.query(
      "SELECT id, name, role, password FROM users WHERE contact_info = ?",
      [contact_info]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // ✅ JWT TOKEN
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role.toUpperCase()
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );


    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role.toUpperCase()
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Server error during login"
    });
  }
};
