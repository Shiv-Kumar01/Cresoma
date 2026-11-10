# 🚀 Cresoma

> **An interactive collaborative study platform built with React, Node.js, Socket.IO and MongoDB.**

Cresoma is a modern study and collaboration platform designed to make learning more interactive. It combines an immersive 3D interface with collaborative tools, games and a real-time whiteboard where multiple users can work together through a shareable board link.

## ✨ Features

### 🎨 Real-Time Collaborative Whiteboard
- Create a shared whiteboard
- Share a unique board link with others
- Draw together in real time
- Pen, eraser, colors, brush size and opacity controls
- Clear and synchronize the board
- Export the whiteboard as an image
- Persistent board data using MongoDB

### 💬 Real-Time Collaboration
- Socket.IO based real-time communication
- Live participant presence
- Real-time collaborative drawing
- Shared chat
- Board-specific collaboration rooms

### 🧠 Study & Interactive Features
- Interactive study dashboard
- Games and engaging learning elements
- Modern responsive interface
- Immersive visual effects and 3D elements

### 🔐 Authentication UI
- Login and signup interfaces
- User-oriented dashboard experience

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Tailwind CSS
- Three.js / WebGL

### Backend
- Node.js
- Express.js
- Socket.IO

### Database
- MongoDB
- MongoDB Atlas
- Mongoose

### Development & Deployment
- Git
- GitHub
- Vercel / Node.js hosting

## 🏗️ Architecture

```text
                ┌──────────────────┐
                │   React + Vite   │
                │    Frontend      │
                └────────┬─────────┘
                         │
                 HTTP / Socket.IO
                         │
                ┌────────▼─────────┐
                │ Node.js + Express │
                │    + Socket.IO    │
                └────────┬─────────┘
                         │
                    Mongoose
                         │
                ┌────────▼─────────┐
                │   MongoDB Atlas   │
                │  Board Persistence│
                └──────────────────┘
```

## 📁 Project Structure

```text
Creseoma_React/
│
├── src/
│   ├── components/
│   ├── Livedashboard/
│   │   ├── CanvasArea.jsx
│   │   ├── LiveDashboard.jsx
│   │   ├── LeftSidebar.jsx
│   │   ├── RightSidebar.jsx
│   │   ├── Toolbar.jsx
│   │   └── useCanvasLogic.js
│   ├── scripts/
│   ├── styles/
│   ├── App.jsx
│   ├── login.jsx
│   ├── signup.jsx
│   └── main.jsx
│
├── server/
│   ├── index.js
│   ├── models/
│   │   └── Board.js
│   └── routes/
│       └── boardRoutes.js
│
├── public/
├── package.json
├── vite.config.js
├── .env.example
├── .gitignore
└── README.md
```

## ⚙️ Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Creseoma_React
```

Install dependencies:

```bash
npm install
```

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB_NAME=cresoma
PORT=5000
CLIENT_URL=http://localhost:5173
```

For the frontend, configure the backend URL if required by the project:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### ⚠️ Security

Never commit your real `.env` file or MongoDB credentials to GitHub.

The MongoDB connection string should remain server-side.

## ▶️ Running the Project

Start the backend:

```bash
npm run server
```

Start the frontend in another terminal:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## 🤝 Collaborative Whiteboard

The whiteboard uses unique board IDs.

A typical shared URL looks like:

```text
/LiveDashboard/<board-id>
```

When another user opens the same board URL, they can join the same collaboration room.

```text
User A
   │
   ├──── Drawing Event ────┐
   │                       │
   ▼                       ▼
Socket.IO Room ───────► User B
   │
   ▼
MongoDB
   │
   └── Persistent Board State
```

Socket.IO handles real-time events while MongoDB stores persistent board information.

## 🧪 Development

Useful commands:

```bash
npm run dev
```

Start frontend development server.

```bash
npm run server
```

Start the Node.js backend.

```bash
npm run build
```

Create a production frontend build.

## 🚀 Deployment

The React frontend and Node.js/Socket.IO backend can be deployed separately.

### Frontend

Suitable platforms include:

- Vercel
- Netlify

### Backend

The Node.js + Socket.IO server requires a hosting provider that supports a persistent server connection, such as:

- Render
- Railway
- Fly.io

MongoDB Atlas can be used as the cloud database.

Update the frontend environment variables with the deployed backend URL before production deployment.

## 🎯 Project Goals

Cresoma focuses on combining:

- Collaborative learning
- Real-time communication
- Interactive study tools
- Modern web development
- 3D web experiences
- Persistent cloud data

The project demonstrates practical full-stack development rather than being limited to a static frontend.

## 👨‍💻 Technologies Demonstrated

- React component architecture
- Vite development workflow
- Node.js backend development
- REST APIs
- MongoDB database integration
- Mongoose ODM
- WebSocket communication with Socket.IO
- Real-time collaboration
- Client-server architecture
- Environment variable management
- Responsive UI development
- Three.js / WebGL concepts
- Git and GitHub workflow

## 📌 Status

🚧 **Active development**

The collaborative whiteboard and MongoDB backend are being integrated and tested as part of the project's full-stack development.

## 📄 License

This project is developed for educational and portfolio purposes.