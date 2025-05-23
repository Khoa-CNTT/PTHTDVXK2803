import { io } from "socket.io-client";

const URL = `https://${import.meta.env.VITE_API_URL}.ngrok-free.app`;

const socket = io(URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"], // Ưu tiên WebSocket
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
});

export default socket;
