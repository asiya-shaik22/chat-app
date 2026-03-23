import { io } from "socket.io-client";

export const socket = io("https://chat-app-backend-o5fr.onrender.com/", {
  transports: ["websocket"]
});