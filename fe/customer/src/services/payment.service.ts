import { PayOSType } from "../types/payment";
import { paymentAPI } from "./customizeAxios.service";

export const createPayOsURL = async (newPayment: PayOSType) => {
  return await paymentAPI.post(`/payos/create-payment`, newPayment).then((res) => res.data);
};
