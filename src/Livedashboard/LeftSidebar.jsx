// LeftSidebar.jsx
import React from "react";

const LeftSidebar = () => {
  return (
    <aside className="dashboard-sidebar left-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">🎨 Drawing Tools</h3>
        <div className="tool-panel">
          <div className="tool-group">
            <button className="tool-btn active" data-tool="pen" title="Pen Tool">✏️ Pen</button>
            <button className="tool-btn" data-tool="brush" title="Brush Tool">🖌️ Brush</button>
            <button className="tool-btn" data-tool="eraser" title="Eraser">🧽 Eraser</button>
            <button className="tool-btn" data-tool="shape" title="Shapes">⬜ Shapes</button>
          </div>
          <div className="tool-group">
            <button className="tool-btn" data-tool="text" title="Text Tool">📝 Text</button>
            <button className="tool-btn" data-tool="sticker" title="Stickers">🏷️ Stickers</button>
            <button className="tool-btn" data-tool="image" title="Image Upload">🖼️ Image</button>
            <button className="tool-btn" data-tool="3d" title="3D Objects">🔲 3D</button>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">🎨 Color Palette</h3>
        <div className="color-palette">
          <div className="color-row">
            <div className="color-swatch active" data-color="#FF6B6B" style={{ background: "#FF6B6B" }}></div>
            <div className="color-swatch" data-color="#4ECDC4" style={{ background: "#4ECDC4" }}></div>
            <div className="color-swatch" data-color="#45B7D1" style={{ background: "#45B7D1" }}></div>
            <div className="color-swatch" data-color="#96CEB4" style={{ background: "#96CEB4" }}></div>
          </div>
          <div className="color-row">
            <div className="color-swatch" data-color="#FFEAA7" style={{ background: "#FFEAA7" }}></div>
            <div className="color-swatch" data-color="#DDA0DD" style={{ background: "#DDA0DD" }}></div>
            <div className="color-swatch" data-color="#98D8C8" style={{ background: "#98D8C8" }}></div>
            <div className="color-swatch" data-color="#F7DC6F" style={{ background: "#F7DC6F" }}></div>
          </div>
          <div className="color-custom">
            <input type="color" id="custom-color" defaultValue="#6366f1" />
            <label htmlFor="custom-color">Custom</label>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">📏 Settings</h3>
        <div className="settings-panel">
          <div className="setting-group">
            <label>Brush Size</label>
            <input type="range" id="brush-size" min="1" max="50" defaultValue="5" />
            <span className="setting-value">5px</span>
          </div>
          <div className="setting-group">
            <label>Opacity</label>
            <input type="range" id="opacity" min="10" max="100" defaultValue="100" />
            <span className="setting-value">100%</span>
          </div>
          <div className="setting-group">
            <label>Layer</label>
            <select id="layer-select" defaultValue="foreground">
              <option value="foreground">Foreground</option>
              <option value="background">Background</option>
              <option value="overlay">Overlay</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
