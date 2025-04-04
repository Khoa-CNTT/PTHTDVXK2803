import { Request, Response } from "express";
import { cancelPaymentLinkSV, createPaymentSV, getPaymentLinkSV } from "../services/payos.service";
import { successResponse } from "../utils/reponse";

export const createPaymentCTL = async (req: Request, res: Response): Promise<any> => {
  try {
    const body = req.body;
    const { amount, orderCode, returnUrl, cancelUrl } = body;
    if (!amount || !orderCode || !returnUrl || !cancelUrl) {
      return res.status(400).json({ message: "Thiếu thông tin." });
    }
    const response = await createPaymentSV(body);
    return successResponse(res, response, "Tạo cổng thanh toán thành công");
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getPaymentLinkCTL = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Thiếu thông tin giao dịch." });
    }
    const response = await getPaymentLinkSV(id);
    return successResponse(res, response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const cancelPaymentCTL = async (req: Request, res: Response): Promise<any> => {
  try {
    const body = req.body;
    const { id, reason } = body;
    if (!id || !reason) {
      return res.status(400).json({ message: "Thiếu thông tin." });
    }
    const response = await cancelPaymentLinkSV(id, reason);
    return successResponse(res, response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
