import { CheckoutRequestType, PayOSType } from "../types/payos";
import payOS from "../config/payos";

export const createPaymentSV = (data: CheckoutRequestType) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await payOS.createPaymentLink(data);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const getPaymentLinkSV = (orderId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await payOS.getPaymentLinkInformation(orderId);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const cancelPaymentLinkSV = (orderId: string, reason: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await payOS.cancelPaymentLink(orderId, reason);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};
