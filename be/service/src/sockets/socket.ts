import { Server } from "socket.io";

let io: Server;
const userSocketMap = new Map<string, string>(); // userId <-> socketId

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    allowUpgrades: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register_user", (userId: number) => {
      if (!userId) {
        socket.emit("custom_error", "userId không hợp lệ");
        return;
      }

      const userIdStr = userId.toString();
      userSocketMap.set(userIdStr, socket.id);

      console.log("user-map", Array.from(userSocketMap.keys()));
      console.log(`Registered user ${userId} with socket ${socket.id}`);

      // Gửi xác nhận đăng ký thành công
      socket.emit("user_registered", {
        userId: userIdStr,
        socketId: socket.id,
        message: "User registered successfully",
      });
    });

    socket.on("payment_status_client", (userId: string) => {
      sendToUser(userId, "payment-status", { status: "success" });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      for (const [userId, sId] of userSocketMap.entries()) {
        if (sId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`Removed userId: ${userId}`);
          break;
        }
      }
    });
  });
};

export const sendToUser = (userId: string | number, event: string, payload: any) => {
  const userIdStr = userId.toString();
  const socketId = userSocketMap.get(userIdStr);

  console.log("sendToUser userId:", userIdStr);
  console.log("Map keys:", Array.from(userSocketMap.keys()));
  console.log("Found socketId:", socketId);

  if (socketId && io) {
    io.to(socketId).emit(event, payload);
    console.log(`Sent "${event}" to user ${userIdStr} via socket ${socketId}`);
    return true;
  } else {
    console.log(`User ${userIdStr} not found in socket map or io not initialized`);
    return false;
  }
};

export { io, userSocketMap };
