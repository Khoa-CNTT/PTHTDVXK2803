import { CheckoutRequestType } from "../@types/payos";
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
    try {
      const response = await payOS.cancelPaymentLink(orderId, reason);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new PayOSService();
