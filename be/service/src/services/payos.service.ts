import { ResultSetHeader } from "mysql2";
import { CheckoutRequestType } from "../@types/payos";
import { bookBusTicketsDB } from "../config/db";
import payOS from "../config/payos";

class PayOSService {
  async createPayment(data: CheckoutRequestType) {
    try {
      const response = await payOS.createPaymentLink(data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentLink(orderId: string) {
    try {
      const response = await payOS.getPaymentLinkInformation(orderId);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async cancelPaymentLink(orderId: string, reason: string) {
    const connection = await bookBusTicketsDB.getConnection();

    try {
      await connection.beginTransaction();

      const [rows] = (await connection.execute("call delete_ticket(?)", [Number(orderId)])) as [
        ResultSetHeader,
        any
      ];

      if (rows.affectedRows <= 0) {
        await connection.rollback();
        return {
          status: "ERR",
          message: "Xóa vé thất bại",
        };
      }

      const response = await payOS.cancelPaymentLink(orderId, reason);

      if (response.status !== "CANCELLED") {
        await connection.rollback();
        return { status: "ERR", message: "Hủy thanh toán thất bại" };
      }

      await connection.commit();

      return {
        status: "OK",
        message: "Hủy thanh toán thành công",
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default new PayOSService();
