import { WebSocketServer } from "ws";
import type { Server } from "http";
import type { WebSocket } from "ws";
import handleChatMessage from "./chatHandler";

export const initChatSocket = (server: Server) => {
  const wss = new WebSocketServer({ server, path: "/ws/chat" });

  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");

    ws.send(
      JSON.stringify({ type: "system", message: "Hiện tại tôi chỉ hỗ trợ tìm chuyến đi xe." })
    );

    ws.on("message", (msg) => {
      handleChatMessage(ws, msg.toString());
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
};
