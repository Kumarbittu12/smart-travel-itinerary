import { Router } from "express";
import {
  createItinerary,
  getAllItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
  getMyItineraries,
  toggleShareItinerary,
  getSharedItineraries
} from "../controllers/itineraryController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { checkItineraryOwner } from "../middleware/ownershipMiddleware.js";

const router = Router();

// 🔐 Protected routes
router.post("/v1", authenticate, createItinerary);
router.put("/v1/:id", authenticate, checkItineraryOwner, updateItinerary);
router.get("/v1/me", authenticate, getMyItineraries);
router.delete("/v1/:id", authenticate, checkItineraryOwner, deleteItinerary); // only the ownner can delete the file
router.patch(
  "/v1/:id/share",
  authenticate,
  checkItineraryOwner,
  toggleShareItinerary
);
router.get("/v1/shared", getSharedItineraries);

// 🔓 Public routes (optional)
router.get("/v1", getAllItineraries);
router.get("/v1/:id", getItineraryById);

export default router;


