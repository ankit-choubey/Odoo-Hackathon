// app.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"
import documentRoutes from "./routes/documentRoutes.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:8080"],
  credentials: true
}));

app.use("/api/auth",authRoutes);
app.use("/api/documents",documentRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Odoo Hackathon Backend is running!");
});

export default app;
