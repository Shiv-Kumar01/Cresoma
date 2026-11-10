import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  { x: Number, y: Number },
  { _id: false }
);

const strokeSchema = new mongoose.Schema(
  {
    tool: { type: String, default: "pen" },
    color: { type: String, default: "#FF6B6B" },
    size: { type: Number, default: 5 },
    opacity: { type: Number, default: 1 },
    points: { type: [pointSchema], default: [] },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true, maxlength: 40 },
    text: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Cresoma Board" },
    strokes: { type: [strokeSchema], default: [] },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Board", boardSchema);
