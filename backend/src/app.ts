import express from "express";
import registerRoutes from "./routes/registerRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";

import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

// Auth routes
app.use("/api/auth", registerRoutes);
app.use("/api/auth", loginRoutes);

// Itinerary routes
app.use("/api/itineraries", itineraryRoutes);

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

export default app;
