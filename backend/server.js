const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// 🔹 In-memory storage
let waitingQueue = [];
let activeChats = {}; // { socketId: partnerSocketId }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ Start searching
  socket.on("start_search", () => {
    console.log("User searching:", socket.id);

    if (waitingQueue.length > 0) {
      const partner = waitingQueue.shift();

      // Pair both users
      activeChats[socket.id] = partner.id;
      activeChats[partner.id] = socket.id;

      socket.emit("matched");
      partner.emit("matched");

      console.log("Matched:", socket.id, "with", partner.id);
    } else {
      waitingQueue.push(socket);
      socket.emit("waiting");
    }
  });

  // ✅ Send message
  socket.on("send_message", (msg) => {
    if (!msg || msg.length > 200) return;
    const partnerId = activeChats[socket.id];

    if (partnerId) {
      io.to(partnerId).emit("receive_message", msg);
    }
  });

  // ✅ Skip chat
  socket.on("skip", () => {
    const partnerId = activeChats[socket.id];

    if (partnerId) {
    const partnerSocket = io.sockets.sockets.get(partnerId);

    if (partnerSocket) {
        partnerSocket.emit("partner_disconnected");

        // 👇 requeue partner also
        waitingQueue.push(partnerSocket);
        partnerSocket.emit("waiting");
    }

    delete activeChats[partnerId];
    }

    delete activeChats[socket.id];

    waitingQueue.push(socket);
    socket.emit("waiting");
});

  // ✅ Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    const partnerId = activeChats[socket.id];

    if (partnerId) {
      io.to(partnerId).emit("partner_disconnected");

      delete activeChats[partnerId];
    }

    delete activeChats[socket.id];

    // Remove from queue if present
    waitingQueue = waitingQueue.filter(
      (user) => user.id !== socket.id
    );
  });
});

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running");
});

server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});