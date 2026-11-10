import express from "express";
import mongoose from "mongoose";
import Board from "../models/Board.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const board = await Board.create({ name: req.body?.name || "Cresoma Board" });
    res.status(201).json({ boardId: board._id.toString() });
  } catch (error) {
    res.status(500).json({ message: "Could not create board" });
  }
});

router.get("/:boardId", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.boardId)) {
      return res.status(400).json({ message: "Invalid board id" });
    }

    const board = await Board.findById(req.params.boardId).lean();
    if (!board) return res.status(404).json({ message: "Board not found" });

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: "Could not load board" });
  }
});

router.put("/:boardId/strokes", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.boardId)) {
      return res.status(400).json({ message: "Invalid board id" });
    }

    const strokes = Array.isArray(req.body?.strokes) ? req.body.strokes : [];
    await Board.findByIdAndUpdate(req.params.boardId, { strokes });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Could not save strokes" });
  }
});

router.post("/:boardId/messages", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.boardId)) {
      return res.status(400).json({ message: "Invalid board id" });
    }

    const sender = String(req.body?.sender || "Guest").trim().slice(0, 40);
    const text = String(req.body?.text || "").trim().slice(0, 500);
    if (!text) return res.status(400).json({ message: "Message is required" });

    const message = { sender, text, createdAt: new Date() };
    await Board.findByIdAndUpdate(req.params.boardId, { $push: { messages: message } });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Could not save message" });
  }
});

export default router;
