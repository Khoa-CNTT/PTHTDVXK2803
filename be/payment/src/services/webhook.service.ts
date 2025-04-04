import { log } from "../utils/logger";

export class WebhookService {
  public async processWebhookEvent(event: any): Promise<void> {
    log(`Processing event: ${JSON.stringify(event)}`);
  }
}
