import { ResultSetHeader } from "mysql2";
import { bookBusTicketsDB } from "../config/db";
import { sendToUser } from "../sockets/socket";
import { UserService } from "./user.service";
import SeatService from "./seat.service";

export class WebhookService {
  private userService = new UserService(bookBusTicketsDB);
  private seatService = new SeatService(bookBusTicketsDB);

  public processWebhookEvent = async (orderCode: number) => {
    const [rowsUpdateTicket] = (await bookBusTicketsDB.execute(
      "update ticket set payment_status = 'paid' where id = ?",
      [orderCode]
    )) as [ResultSetHeader, any];

    if (rowsUpdateTicket.affectedRows <= 0) {
      return { status: "ERR", message: "Cập nhật trạng thái vé thất bại" };
    } else {
      const ticketInfo = await this.getTicketIdByOrderCode(orderCode);
      const { tripId, customerId, email, fullName, phone, seats, paymentType, price } = ticketInfo;
      console.log("seats", seats);
      const updateSeats = await this.seatService.update(seats, tripId, customerId, "booked");
      const userId = await this.userService.getUser(customerId);
      console.log("userId", userId);
      sendToUser(userId, "payment_success", {
        message: `Thanh toán thành công đơn ${orderCode}`,
      });
    }
  };

  getTicketIdByOrderCode = async (id: number) => {
    try {
      const [rows]: any = await bookBusTicketsDB.execute("call fetch_ticket(?)", [id]);
      return rows && rows[0][0] ? rows[0][0] : null;
    } catch (error) {
      throw error;
    }
  };
}
