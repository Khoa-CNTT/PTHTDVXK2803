// socket.ts
import { Server } from "socket.io";
import { decode } from "../services/auth.service";

export let io: Server;
const userSocketMap = new Map<string, string>(); // userId -> socketId

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("register_user", (userId: string) => {
      console.log("decode-access-token", decode(userId));
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const [userId, sId] of userSocketMap.entries()) {
        if (sId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
      console.log("Client disconnected:", socket.id);
    });
  });
};

export const sendToUser = (userId: string, event: string, payload: any) => {
  const socketId = userSocketMap.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, payload);
  }
};
