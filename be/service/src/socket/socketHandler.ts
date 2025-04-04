import { Server, Socket } from "socket.io";

// Define kiểu dữ liệu  cho event (selectSeat)
interface SelectSeatPayload {
  tripId: number;
  CustomerId: number;
  seatNumber: string;
}

export default function socketHandler(io: Server, socket: Socket) {
  console.log(`User connecting: ${socket.id}`);

  // Xử lý sự kiện Selected Seat
  socket.on("selectSeat", ({ tripId, CustomerId, seatNumber }: SelectSeatPayload) => {
    console.log(`${CustomerId} selecting ${seatNumber} on ${tripId}`);
    io.emit("seatUpdate", { tripId, CustomerId, seatNumber, status: "pending" });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnect ${socket.id}`);
  });
}
