import { Request, Response } from "express";
import { WebhookService } from "../services/webhook.service";
import { log } from "../utils/logger";

const webhookService = new WebhookService();

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const event = req.body;
  console.log("event", event);
  try {
    await webhookService.processWebhookEvent(event);
    res.status(200).send("Webhook received and processed successfully");
  } catch (error) {
    log(`Error processing webhook: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};
