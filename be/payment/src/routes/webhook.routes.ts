import { Router } from "express";
import { handleWebhook } from "../controllers/webhook.controller";
import { verifySignature } from "../middlewares/verifySignature";

const router = Router();

router.post("/payos", handleWebhook);

export default router;
