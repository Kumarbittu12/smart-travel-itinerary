import type { Request, Response } from "express";
import db from "../db/index.js";

/**
 * CREATE ITINERARY (JWT-based)
 */
export const createItinerary = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id; // ✅ FROM JWT

    const {
      destination,
      start_date,
      end_date,
      budget,
      activities,
      notes,
      media_paths
    } = req.body || {};

    if (!user_id || !destination || !start_date || !end_date) {
      return res.status(400).json({
        message: "destination, start_date, end_date are required"
      });
    }

    let activitiesJson = null;
    if (Array.isArray(activities)) {
      activitiesJson = JSON.stringify(activities);
    }

    let mediaPathsJson = null;
    if (Array.isArray(media_paths)) {
      mediaPathsJson = JSON.stringify(media_paths);
    }

    const [result]: any = await db.query(
      `INSERT INTO itineraries
       (user_id, destination, start_date, end_date, budget, activities, notes, media_paths)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        destination,
        start_date,
        end_date,
        budget ?? null,
        activitiesJson,
        notes ?? null,
        mediaPathsJson ?? null
      ]
    );

    return res.status(201).json({
      message: "Itinerary created successfully",
      itineraryId: result.insertId
    });

  } catch (error: any) {
    console.error("🔥 CREATE ITINERARY ERROR:", error);
    return res.status(500).json({
      message: "Server error while creating itinerary"
    });
  }
};

/**
 * @desc    Get itineraries of logged-in user
 * @route   GET /api/itineraries/v1/me
 * @access  Protected
 */
export const getMyItineraries = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const [rows]: any = await db.query(
      `SELECT 
         id,
         destination,
         start_date,
         end_date,
         budget,
         created_at
       FROM itineraries
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [user_id]
    );

    return res.status(200).json({
      count: rows.length,
      itineraries: rows
    });

  } catch (error: any) {
    console.error("🔥 Get My Itineraries Error:", error);
    return res.status(500).json({
      message: "Server error while fetching user itineraries"
    });
  }
};


/**
 * GET ALL ITINERARIES
 */
export const getAllItineraries = async (_req: Request, res: Response) => {
  const [rows]: any = await db.query("SELECT * FROM itineraries");
  return res.status(200).json({
    count: rows.length,
    itineraries: rows
  });
};

/**
 * GET ITINERARY BY ID
 */
export const getItineraryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const [rows]: any = await db.query(
    "SELECT * FROM itineraries WHERE id = ?",
    [id]
  );

  if (!rows.length) {
    return res.status(404).json({ message: "Itinerary not found" });
  }

  return res.status(200).json(rows[0]);
};

/**
 * UPDATE ITINERARY
 */
export const updateItinerary = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    destination,
    start_date,
    end_date,
    budget,
    activities,
    notes,
    media_paths
  } = req.body || {};

  let activitiesJson = null;
  if (Array.isArray(activities)) {
    activitiesJson = JSON.stringify(activities);
  }

  let mediaPathsJson = null;
  if (Array.isArray(media_paths)) {
    mediaPathsJson = JSON.stringify(media_paths);
  }

  const [result]: any = await db.query(
    `UPDATE itineraries SET
      destination = COALESCE(?, destination),
      start_date  = COALESCE(?, start_date),
      end_date    = COALESCE(?, end_date),
      budget      = COALESCE(?, budget),
      activities  = COALESCE(?, activities),
      notes       = COALESCE(?, notes),
      media_paths = COALESCE(?, media_paths)
     WHERE id = ?`,
    [
      destination ?? null,
      start_date ?? null,
      end_date ?? null,
      budget ?? null,
      activitiesJson,
      notes ?? null,
      mediaPathsJson ?? null,
      id
    ]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Itinerary not found" });
  }

  return res.status(200).json({ message: "Itinerary updated successfully" });
};




/**
 * DELETE ITINERARY
 */
export const deleteItinerary = async (req: Request, res: Response) => {
  const { id } = req.params;

  const [result]: any = await db.query(
    "DELETE FROM itineraries WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Itinerary not found" });
  }

  return res.status(200).json({ message: "Itinerary deleted successfully" });
};

/**
 * @desc    Toggle itinerary sharing
 * @route   PATCH /api/itineraries/v1/:id/share
 * @access  Owner only
 */
export const toggleShareItinerary = async (req: Request, res: Response) => {
  const { id } = req.params;

  await db.query(
    "UPDATE itineraries SET is_public = !is_public WHERE id = ?",
    [id]
  );

  return res.status(200).json({
    message: "Sharing status updated"
  });
};

/**
 * @desc    Get all shared itineraries
 * @route   GET /api/itineraries/v1/shared
 * @access  Public
 */
export const getSharedItineraries = async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM itineraries WHERE is_public = true"
    );

    return res.status(200).json({
      count: rows.length,
      itineraries: rows
    });

  } catch (error: any) {
    return res.status(500).json({
      message: "Server error while fetching shared itineraries"
    });
  }
};
