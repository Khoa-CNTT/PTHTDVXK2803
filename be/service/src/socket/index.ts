import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import socketHandler from "./socketHandler";
export default function initSocket(server: HttpServer): Server {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socketHandler(io, socket);
  });

  return io;
}
