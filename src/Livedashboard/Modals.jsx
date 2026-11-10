// Modals.jsx
import React from "react";

const Modals = () => {
  return (
    <>
      <div className="modal" id="shape-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Select Shape</h3>
            <button className="modal-close" id="shape-modal-close">×</button>
          </div>
          <div className="modal-body">
            <div className="shape-grid">
              <button className="shape-btn" data-shape="rectangle">⬜ Rectangle</button>
              <button className="shape-btn" data-shape="circle">⭕ Circle</button>
              <button className="shape-btn" data-shape="triangle">🔺 Triangle</button>
              <button className="shape-btn" data-shape="line">➖ Line</button>
              <button className="shape-btn" data-shape="arrow">➡️ Arrow</button>
              <button className="shape-btn" data-shape="star">⭐ Star</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" id="sticker-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Select Sticker</h3>
            <button className="modal-close" id="sticker-modal-close">×</button>
          </div>
          <div className="modal-body">
            <div className="sticker-grid">
              <button className="sticker-btn" data-sticker="👍">👍</button>
              <button className="sticker-btn" data-sticker="❤️">❤️</button>
              <button className="sticker-btn" data-sticker="🎉">🎉</button>
              <button className="sticker-btn" data-sticker="💡">💡</button>
              <button className="sticker-btn" data-sticker="⚠️">⚠️</button>
              <button className="sticker-btn" data-sticker="❓">❓</button>
              <button className="sticker-btn" data-sticker="✅">✅</button>
              <button className="sticker-btn" data-sticker="❌">❌</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modals;
