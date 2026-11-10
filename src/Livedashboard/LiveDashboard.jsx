import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./dashboard.css";
import CanvasArea from "./CanvasArea";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Modals from "./Modals";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const LiveDashboard = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [activeBoardId, setActiveBoardId] = useState(boardId || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function ensureBoard() {
      try {
        if (boardId) {
          const response = await fetch(`${API_URL}/api/boards/${boardId}`);
          if (!response.ok) throw new Error("Board not found");
          if (!cancelled) { setActiveBoardId(boardId); setLoading(false); }
          return;
        }
        const response = await fetch(`${API_URL}/api/boards`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Cresoma Board" }) });
        if (!response.ok) throw new Error("Could not create board");
        const data = await response.json();
        if (!cancelled) navigate(`/LiveDashboard/${data.boardId}`, { replace: true });
      } catch (error) {
        console.error(error);
        if (!cancelled) setLoading(false);
      }
    }
    ensureBoard();
    return () => { cancelled = true; };
  }, [boardId, navigate]);

  if (loading || !activeBoardId) {
    return <div className="loading-overlay" style={{ display: "flex", position: "fixed", inset: 0, zIndex: 9999 }}><div className="loading-content"><div className="loading-spinner" /><p className="loading-text">Creating collaborative board...</p></div></div>;
  }

  return (
    <div className="dashboard-main">
      <div className="dashboard-container">
        <LeftSidebar />
        <section className="canvas-area">
          <div className="canvas-container">
            <CanvasArea boardId={activeBoardId} />
            <div className="canvas-overlay">
              <div className="canvas-info"><span className="canvas-coords">X: 0, Y: 0</span><span className="canvas-zoom">Zoom: 100%</span></div>
              <div className="canvas-controls">
                <button className="control-btn" id="undo-btn">↶</button><button className="control-btn" id="redo-btn">↷</button><button className="control-btn" id="clear-btn">🗑️</button><button className="control-btn" id="save-btn">💾</button><button className="control-btn btn-accent" id="share-btn">📤</button><button className="control-btn btn-accent" id="export-btn">💾</button><button className="control-btn btn-accent" id="fullscreen-btn">⛶</button>
              </div>
            </div>
          </div>
        </section>
        <RightSidebar />
      </div>
      <footer className="dashboard-footer">
        <div className="footer-toolbar">
          <div className="toolbar-section"><button className="toolbar-btn" id="zoom-in-btn">🔍+</button><button className="toolbar-btn" id="zoom-out-btn">🔍-</button><button className="toolbar-btn" id="reset-view-btn">🏠</button></div>
          <div className="toolbar-section"><button className="toolbar-btn" id="grid-toggle-btn">⊞</button><button className="toolbar-btn" id="snap-toggle-btn">🔗</button><button className="toolbar-btn" id="ruler-toggle-btn">📏</button></div>
          <div className="toolbar-section"><button className="toolbar-btn" id="presentation-btn">📊</button><button className="toolbar-btn" id="record-btn">⏺️</button><button className="toolbar-btn" id="screenshot-btn">📸</button></div>
        </div>
      </footer>
      <Modals />
    </div>
  );
};

export default LiveDashboard;
