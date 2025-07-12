import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import Document from "../models/document.js";

const router = express.Router();

// POST /api/documents → Submit a new doc
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, fileUrl } = req.body;

    const newDoc = await Document.create({
      title,
      fileUrl,
      userId: req.user.id
    });

    res.status(201).json({ message: "Document submitted", document: newDoc });
  } catch (err) {
    res.status(500).json({ message: "Error submitting document" });
  }
});

// GET /api/documents → List user’s documents
router.get("/", verifyToken, async (req, res) => {
  const docs = await Document.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(docs);
});

export default router;
