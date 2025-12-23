import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: number;
  role: string;
}

// Global augmentation for Express Request
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing"
      });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authorization token missing"
      });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    // 4️⃣ Attach user to request (Type Guard)
    if (typeof decoded === "object" && decoded !== null) {
      req.user = decoded as UserPayload;
      next();
    } else {
      throw new Error("Invalid token payload");
    }

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};
