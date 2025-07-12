import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

console.log("🚀 Starting backend...");

dotenv.config();
console.log("📦 Environment variables loaded");

const PORT = process.env.PORT || 4000;
const DB_URI = `${process.env.MONGODB_URI}/${process.env.DB_NAME}`;
console.log("🧠 Connecting to MongoDB:", DB_URI);

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
