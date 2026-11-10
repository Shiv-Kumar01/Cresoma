// RightSidebar.jsx
import React from "react";

const RightSidebar = () => {
  return (
    <aside className="dashboard-sidebar right-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">👥 Participants</h3>
        <div className="participants-list">
          <div className="participant active">
            <div className="participant-avatar">👤</div>
            <div className="participant-info">
              <span className="participant-name">You</span>
              <span className="participant-status">Drawing</span>
            </div>
            <div className="participant-cursor" style={{ ["--color"]: "#FF6B6B" }}></div>
          </div>
          <div className="participant">
            <div className="participant-avatar">👤</div>
            <div className="participant-info">
              <span className="participant-name">Alex Chen</span>
              <span className="participant-status">Online</span>
            </div>
            <div className="participant-cursor" style={{ ["--color"]: "#4ECDC4" }}></div>
          </div>
          <div className="participant">
            <div className="participant-avatar">👤</div>
            <div className="participant-info">
              <span className="participant-name">Sarah Kim</span>
              <span className="participant-status">Typing...</span>
            </div>
            <div className="participant-cursor" style={{ ["--color"]: "#45B7D1" }}></div>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">💬 Chat</h3>
        <div className="chat-container">
          <div className="chat-messages">
            <div className="message">
              <span className="message-sender">Alex Chen</span>
              <span className="message-time">2:30 PM</span>
              <p className="message-text">Great idea! Let's add some 3D elements here.</p>
            </div>
            <div className="message">
              <span className="message-sender">Sarah Kim</span>
              <span className="message-time">2:32 PM</span>
              <p className="message-text">I'm working on the color scheme. What do you think?</p>
            </div>
            <div className="message">
              <span className="message-sender">You</span>
              <span className="message-time">2:35 PM</span>
              <p className="message-text">Perfect! The collaboration is going smoothly.</p>
            </div>
          </div>
          <div className="chat-input">
            <input type="text" placeholder="Type your message..." id="chat-input" />
            <button className="send-btn" id="send-btn">📤</button>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">📋 History</h3>
        <div className="history-list"></div>
      </div>
    </aside>
  );
};

export default RightSidebar;
