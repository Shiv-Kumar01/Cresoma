import { useCallback, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_URL;

export default function useCanvasLogic(canvasRef, boardId) {
  const ctxRef = useRef(null);
  const socketRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef(null);
  const strokesRef = useRef([]);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const currentToolRef = useRef("pen");
  const currentColorRef = useRef("#FF6B6B");
  const brushSizeRef = useRef(5);
  const opacityRef = useRef(1);
  const canvasStateRef = useRef({ zoom: 1, panX: 0, panY: 0, gridVisible: false, rulerVisible: false });

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    const rect = container?.getBoundingClientRect() || { width: 1200, height: 800 };
    const old = document.createElement("canvas");
    old.width = canvas.width || 1200;
    old.height = canvas.height || 800;
    old.getContext("2d")?.drawImage(canvas, 0, 0);
    canvas.width = Math.min(1200, Math.max(600, rect.width - 40));
    canvas.height = Math.min(800, Math.max(400, rect.height - 40));
    ctxRef.current = canvas.getContext("2d");
    ctxRef.current.fillStyle = "white";
    ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);
    redrawAll();
  }, [canvasRef]);

  function drawStroke(stroke) {
    const ctx = ctxRef.current;
    if (!ctx || !stroke?.points?.length) return;
    const points = stroke.points;
    ctx.save();
    ctx.strokeStyle = stroke.tool === "eraser" ? "white" : stroke.color;
    ctx.lineWidth = stroke.tool === "eraser" ? stroke.size * 2 : stroke.size;
    ctx.globalAlpha = stroke.opacity ?? 1;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i].x, points[i].y);
    if (points.length === 1) ctx.lineTo(points[0].x + 0.01, points[0].y + 0.01);
    ctx.stroke();
    ctx.restore();
  }

  function drawGrid() {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas || !canvasStateRef.current.gridVisible) return;
    ctx.save();
    ctx.strokeStyle = "rgba(0,0,0,.07)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    ctx.restore();
  }

  function redrawAll() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    strokesRef.current.forEach(drawStroke);
    drawGrid();
  }

  function updateCanvasInfo(x = 0, y = 0) {
    const coords = document.querySelector(".canvas-coords");
    const zoom = document.querySelector(".canvas-zoom");
    if (coords) coords.textContent = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
    if (zoom) zoom.textContent = `Zoom: ${Math.round(canvasStateRef.current.zoom * 100)}%`;
  }

  function saveHistory() {
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(JSON.parse(JSON.stringify(strokesRef.current)));
    historyIndexRef.current += 1;
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
      historyIndexRef.current -= 1;
    }
  }

  function syncCurrentStrokes() {
    socketRef.current?.emit("replace-strokes", strokesRef.current);
  }

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / canvasStateRef.current.zoom,
      y: (event.clientY - rect.top) / canvasStateRef.current.zoom,
    };
  };

  const startDrawing = (event) => {
    if (event.button !== 0) return;
    const point = getPoint(event);
    isDrawingRef.current = true;
    currentStrokeRef.current = {
      tool: currentToolRef.current,
      color: currentColorRef.current,
      size: brushSizeRef.current,
      opacity: opacityRef.current,
      points: [point],
    };
    drawStroke(currentStrokeRef.current);
  };

  const draw = (event) => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    const point = getPoint(event);
    currentStrokeRef.current.points.push(point);
    drawStroke({ ...currentStrokeRef.current, points: currentStrokeRef.current.points.slice(-2) });
    updateCanvasInfo(point.x, point.y);
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    isDrawingRef.current = false;
    const stroke = currentStrokeRef.current;
    currentStrokeRef.current = null;
    if (stroke.points.length) {
      strokesRef.current.push(stroke);
      saveHistory();
      socketRef.current?.emit("stroke", stroke);
    }
  };

  function renderParticipants(users) {
    const list = document.querySelector(".participants-list");
    if (!list) return;
    list.innerHTML = users.map((user) => `
      <div class="participant active">
        <div class="participant-avatar">👤</div>
        <div class="participant-info">
          <span class="participant-name">${escapeHtml(user.name)}</span>
          <span class="participant-status">Online</span>
        </div>
        <div class="participant-cursor" style="--color:#4ECDC4"></div>
      </div>
    `).join("");
  }

  function renderMessages(messages) {
    const container = document.querySelector(".chat-messages");
    if (!container) return;
    container.innerHTML = messages.map(messageHtml).join("");
    container.scrollTop = container.scrollHeight;
  }

  function addChatMessage(message) {
    const container = document.querySelector(".chat-messages");
    if (!container) return;
    container.insertAdjacentHTML("beforeend", messageHtml(message));
    container.scrollTop = container.scrollHeight;
  }

  function messageHtml(message) {
    const time = new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `<div class="message"><span class="message-sender">${escapeHtml(message.sender)}</span><span class="message-time">${time}</span><p class="message-text">${escapeHtml(message.text)}</p></div>`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }

  const attachUIHandlers = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return () => {};

    const handlers = [];
    const on = (element, event, handler) => {
      if (!element) return;
      element.addEventListener(event, handler);
      handlers.push(() => element.removeEventListener(event, handler));
    };

    document.querySelectorAll(".tool-btn").forEach((btn) => on(btn, "click", () => {
      currentToolRef.current = btn.dataset.tool;
      document.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (btn.dataset.tool === "shape") document.getElementById("shape-modal")?.classList.add("show");
      if (btn.dataset.tool === "sticker") document.getElementById("sticker-modal")?.classList.add("show");
    }));

    document.querySelectorAll(".color-swatch").forEach((swatch) => on(swatch, "click", () => {
      currentColorRef.current = swatch.dataset.color;
      document.querySelectorAll(".color-swatch").forEach((s) => s.classList.remove("active"));
      swatch.classList.add("active");
    }));

    on(document.getElementById("custom-color"), "input", (e) => { currentColorRef.current = e.target.value; });
    on(document.getElementById("brush-size"), "input", (e) => {
      brushSizeRef.current = Number(e.target.value);
      e.target.nextElementSibling.textContent = `${brushSizeRef.current}px`;
    });
    on(document.getElementById("opacity"), "input", (e) => {
      opacityRef.current = Number(e.target.value) / 100;
      e.target.nextElementSibling.textContent = `${e.target.value}%`;
    });

    on(canvas, "mousedown", startDrawing);
    on(canvas, "mousemove", draw);
    on(canvas, "mouseleave", stopDrawing);
    on(window, "mouseup", stopDrawing);

    on(document.getElementById("clear-btn"), "click", () => {
      strokesRef.current = [];
      saveHistory();
      redrawAll();
      socketRef.current?.emit("clear-board");
    });

    on(document.getElementById("undo-btn"), "click", () => {
      if (historyIndexRef.current <= 0) return;
      historyIndexRef.current -= 1;
      strokesRef.current = JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current] || []));
      redrawAll();
      syncCurrentStrokes();
    });

    on(document.getElementById("redo-btn"), "click", () => {
      if (historyIndexRef.current >= historyRef.current.length - 1) return;
      historyIndexRef.current += 1;
      strokesRef.current = JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current] || []));
      redrawAll();
      syncCurrentStrokes();
    });

    on(document.getElementById("save-btn"), "click", () => downloadCanvas("cresoma-drawing.png"));
    on(document.getElementById("screenshot-btn"), "click", () => downloadCanvas("cresoma-screenshot.png"));

    on(document.getElementById("share-btn"), "click", async () => {
      const url = window.location.href;
      try {
        if (navigator.share) await navigator.share({ title: "Cresoma Live Dashboard", text: "Join my Cresoma whiteboard", url });
        else await navigator.clipboard.writeText(url);
        alert("Board link copied!");
      } catch (_) {}
    });

    on(document.getElementById("zoom-in-btn"), "click", () => { canvasStateRef.current.zoom = Math.min(5, canvasStateRef.current.zoom * 1.2); updateCanvasInfo(); });
    on(document.getElementById("zoom-out-btn"), "click", () => { canvasStateRef.current.zoom = Math.max(.1, canvasStateRef.current.zoom * .8); updateCanvasInfo(); });
    on(document.getElementById("reset-view-btn"), "click", () => { canvasStateRef.current.zoom = 1; updateCanvasInfo(); });
    on(document.getElementById("grid-toggle-btn"), "click", () => { canvasStateRef.current.gridVisible = !canvasStateRef.current.gridVisible; redrawAll(); });
    on(document.getElementById("presentation-btn"), "click", () => document.body.classList.toggle("presentation-mode"));

    on(document.getElementById("send-btn"), "click", sendChat);
    on(document.getElementById("chat-input"), "keydown", (e) => { if (e.key === "Enter") sendChat(); });

    window.addEventListener("resize", resizeCanvas);
    handlers.push(() => window.removeEventListener("resize", resizeCanvas));
    return () => handlers.forEach((cleanup) => cleanup());
  }, [resizeCanvas]);

  function sendChat() {
    const input = document.getElementById("chat-input");
    const text = input?.value.trim();
    if (!text) return;
    socketRef.current?.emit("chat-message", { sender: localStorage.getItem("cresoma-name") || "You", text });
    input.value = "";
  }

  function downloadCanvas(filename) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext("2d");
    resizeCanvas();
    saveHistory();
    updateCanvasInfo();

    socketRef.current = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    const socket = socketRef.current;
    const name = localStorage.getItem("cresoma-name") || `Guest-${Math.floor(Math.random() * 9000 + 1000)}`;
    localStorage.setItem("cresoma-name", name);

    socket.on("connect", () => socket.emit("join-board", { boardId, name }));
    socket.on("board-state", ({ strokes = [], messages = [] }) => {
      strokesRef.current = strokes;
      historyRef.current = [JSON.parse(JSON.stringify(strokes))];
      historyIndexRef.current = 0;
      redrawAll();
      renderMessages(messages);
    });
    socket.on("stroke", (stroke) => { strokesRef.current.push(stroke); drawStroke(stroke); saveHistory(); });
    socket.on("replace-strokes", (strokes) => { strokesRef.current = strokes || []; redrawAll(); });
    socket.on("clear-board", () => { strokesRef.current = []; redrawAll(); });
    socket.on("participants", renderParticipants);
    socket.on("chat-message", addChatMessage);

    return () => socket.disconnect();
  }, [boardId, resizeCanvas]);

  useEffect(() => {
    return () => socketRef.current?.disconnect();
  }, []);

  return { initCanvas, attachUIHandlers, updateCanvasInfoRef: () => updateCanvasInfo() };
}
