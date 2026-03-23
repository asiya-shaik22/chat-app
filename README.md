# Anonymous Random Chat System

## 🚀 Overview

This is a full-stack real-time anonymous chat application where users are randomly paired for one-to-one conversations.

---

## 🏗️ Architecture

Frontend (React) → WebSocket → Backend (Node.js + Socket.IO)

* Frontend handles UI and user interactions
* Backend handles matchmaking and message routing
* Uses in-memory data structures for fast pairing

---

## ⚙️ Features

* Anonymous user connection (no login)
* Random matchmaking (queue-based)
* Real-time messaging using WebSockets
* Skip / Rematch functionality
* Partner disconnect handling
* Message length limiting
* Basic UI with status updates

---

## 🔄 Matchmaking Flow

1. User clicks "Start Chat"
2. User is added to waiting queue
3. If another user is available → paired instantly
4. Both users enter chat session

---

## 💬 Chat Flow

* Messages are sent via WebSocket
* Backend forwards message to paired user
* Chat is one-to-one only

---

## 🔁 Rematch Flow

* User clicks "Skip"
* Both users are disconnected
* Both re-enter matchmaking queue

---

## 🚀 Deployment

* Frontend deployed on Vercel
* Backend deployed on Render

---

## 🛠️ Tech Stack

* React
* Node.js
* Socket.IO
* Express

---

## 📦 Setup Instructions

### Backend

cd backend
npm install
node server.js

### Frontend

cd frontend
npm install
npm start

---

## 🌐 Live Links

Frontend: (add after deployment)
Backend: (add after deployment)

---
