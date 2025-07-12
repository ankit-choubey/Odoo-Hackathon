// models/Document.js
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: String,
  fileUrl: String,
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "error"],
    default: "pending"
  },
  result: {
    summary: String,
    category: String,
    confidence: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Document = mongoose.model("Document", documentSchema);
export default Document;
