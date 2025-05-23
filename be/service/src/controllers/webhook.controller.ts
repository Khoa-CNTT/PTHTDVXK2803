import { Request, Response } from "express";
import { WebhookService } from "../services/webhook.service";
import { log } from "../utils/logger";
import { errorResponse, successResponse } from "../utils/response.util";

const webhookService = new WebhookService();

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("event", req.body);
    const { desc, success, data } = req.body;

    if (desc !== "success" || success !== true) {
      console.warn("Webhook không hợp lệ:", req.body);
      res.status(200).json({ message: "Webhook ignored" });
      return;
    }

    const response = await webhookService.processWebhookEvent(data.orderCode);
    successResponse(res, 200, response);
  } catch (error) {
    log(`Error processing webhook: ${error}`);
    errorResponse(res, "Internal Server Error", 500);
  }
};
