import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import boardRoutes from "./routes/boardRoutes.js";
import Board from "./models/Board.js";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: CLIENT_URL.split(",").map((url) => url.trim()), credentials: true }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "cresoma-api" }));
app.use("/api/boards", boardRoutes);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL.split(",").map((url) => url.trim()),
    methods: ["GET", "POST", "PUT"],
  },
});

const rooms = new Map();

function getRoomUsers(boardId) {
  return [...(rooms.get(boardId)?.values() || [])];
}

io.on("connection", (socket) => {
  socket.on("join-board", async ({ boardId, name }) => {
    if (!boardId || !mongoose.isValidObjectId(boardId)) return;

    socket.join(boardId);
    socket.data.boardId = boardId;
    socket.data.name = String(name || `Guest-${socket.id.slice(0, 4)}`).slice(0, 40);

    if (!rooms.has(boardId)) rooms.set(boardId, new Map());
    rooms.get(boardId).set(socket.id, { id: socket.id, name: socket.data.name });

    const board = await Board.findById(boardId).lean();
    if (board) {
      socket.emit("board-state", {
        strokes: board.strokes || [],
        messages: board.messages || [],
      });
    }

    io.to(boardId).emit("participants", getRoomUsers(boardId));
  });

  socket.on("stroke", async (stroke) => {
    const boardId = socket.data.boardId;
    if (!boardId || !stroke?.points?.length) return;

    socket.to(boardId).emit("stroke", stroke);

    try {
      await Board.findByIdAndUpdate(boardId, { $push: { strokes: stroke } });
    } catch (error) {
      socket.emit("server-error", "Stroke could not be saved");
    }
  });

  socket.on("replace-strokes", async (strokes) => {
    const boardId = socket.data.boardId;
    if (!boardId) return;

    const safeStrokes = Array.isArray(strokes) ? strokes : [];
    await Board.findByIdAndUpdate(boardId, { strokes: safeStrokes });
    socket.to(boardId).emit("replace-strokes", safeStrokes);
  });

  socket.on("clear-board", async () => {
    const boardId = socket.data.boardId;
    if (!boardId) return;

    await Board.findByIdAndUpdate(boardId, { strokes: [] });
    io.to(boardId).emit("clear-board");
  });

  socket.on("chat-message", async ({ sender, text }) => {
    const boardId = socket.data.boardId;
    const messageText = String(text || "").trim().slice(0, 500);
    if (!boardId || !messageText) return;

    const message = {
      sender: String(sender || socket.data.name || "Guest").slice(0, 40),
      text: messageText,
      createdAt: new Date(),
    };

    await Board.findByIdAndUpdate(boardId, { $push: { messages: message } });
    io.to(boardId).emit("chat-message", message);
  });

  socket.on("cursor-move", (cursor) => {
    const boardId = socket.data.boardId;
    if (boardId) socket.to(boardId).emit("cursor-move", { ...cursor, id: socket.id });
  });

  socket.on("disconnect", () => {
    const boardId = socket.data.boardId;
    if (!boardId || !rooms.has(boardId)) return;

    rooms.get(boardId).delete(socket.id);
    io.to(boardId).emit("participants", getRoomUsers(boardId));
    if (rooms.get(boardId).size === 0) rooms.delete(boardId);
  });
});

mongoose
  .connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME || "cresoma" })
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => console.log(`Cresoma API running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
