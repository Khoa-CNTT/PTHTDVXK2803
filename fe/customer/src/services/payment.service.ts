import { toast } from "react-toastify";
import { PayOSType } from "../types/payment";
import { bookTicketAPI } from "./customizeAxios.service";

export const createPayOsURL = async (newPayment: PayOSType) => {
  try {
    const response = await bookTicketAPI.post(`/payos/create-payment`, newPayment);
    return response.data;
  } catch (err) {
    toast.warning(err instanceof Error ? err.message : "Lỗi khi tạo link thanh toán");
    return null;
  }
};

export const cancelPaymentPayOS = async ({ id, reason }: { id: number; reason: string }) => {
  try {
    const response = await bookTicketAPI.post(`/payos/cancel-payment-link`, { id, reason });
    return response.data;
  } catch (err) {
    toast.warning(err instanceof Error ? err.message : "Lỗi khi huỷ thanh toán");
    return null;
  }
};
