import type { Request, Response, NextFunction } from "express";
import db from "../db/index.js";

export const checkItineraryOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const itineraryId = req.params.id;
    const userId = req.user?.id;

    const [rows]: any = await db.query(
      "SELECT user_id FROM itineraries WHERE id = ?",
      [itineraryId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    if (rows[0].user_id !== userId) {
      return res.status(403).json({
        message: "You are not allowed to modify this itinerary"
      });
    }

    next();
  } catch {
    return res.status(500).json({ message: "Ownership check failed" });
  }
};
