import { Router } from "express";
import { registerUser } from "../controllers/registerController.js";

const router = Router();

router.post("/v1/register", registerUser);

export default router;
