import { ResultSetHeader } from "mysql2";
import { bookBusTicketsDB } from "../config/db";
import { sendToUser } from "../sockets/socket";
import { UserService } from "./user.service";
import SeatService from "./seat.service";
import { TicketType } from "../@types/ticket";

export class WebhookService {
  private userService = new UserService(bookBusTicketsDB);
  private seatService = new SeatService(bookBusTicketsDB);

  public processWebhookEvent = async (orderCode: number) => {
    try {
      const [rowsUpdateTicket] = (await bookBusTicketsDB.execute(
        "update ticket set payment_status = 'paid' where id = ?",
        [orderCode]
      )) as [ResultSetHeader, any];

      if (rowsUpdateTicket.affectedRows <= 0) {
        return { status: "ERR", message: "Cập nhật trạng thái vé thất bại" };
      }
      const [rowsTicket] = (await bookBusTicketsDB.execute(
        "update ticket set payment_status = 'paid' where id = ?",
        [orderCode]
      )) as [ResultSetHeader, any];
      if (rowsTicket.affectedRows <= 0) {
        return {
          status: "ERR",
          message: "Chưa cập nhật được trạng thái vé, Vui lòng liên hệ nhân viên để khác phục",
        };
      } else {
        const ticketInfo = await this.getTicketIdByOrderCode(orderCode);
        if (!ticketInfo) {
          return { status: "ERR", message: "Không tìm thấy thông tin vé" };
        }
        // Update seats
        const updateSeats = await this.seatService.updateSeats(
          ticketInfo.map((tk) => tk.seatPosition),
          ticketInfo[0].tripId,
          ticketInfo[0].customerId,
          "booked"
        );
        // Get user info
        const userId = ticketInfo[0].customerId.toString();
        const socketSent = sendToUser(userId, "payment-status", {
          status: "success",
          message: `Thanh toán thành công đơn ${orderCode}`,
          orderCode: orderCode,
          ticketInfo: ticketInfo,
        });

        console.log(
          `Socket notification sent to user ${userId}: ${socketSent ? "SUCCESS" : "FAILED"}`
        );

        return {
          status: "OK",
          message: "Xử lý thanh toán thành công",
          socketSent,
        };
      }
    } catch (error) {
      console.error("Error in processWebhookEvent:", error);
      return { status: "ERR", message: "Lỗi xử lý webhook", error };
    }
  };

  getTicketIdByOrderCode = async (id: number) => {
    try {
      const [rows] = await bookBusTicketsDB.execute("call fetch_ticket(?)", [id]);
      return rows && rows[0] ? (rows[0] as TicketType[]) : null;
    } catch (error) {
      console.error("Error in getTicketIdByOrderCode:", error);
      throw error;
    }
  };
}
