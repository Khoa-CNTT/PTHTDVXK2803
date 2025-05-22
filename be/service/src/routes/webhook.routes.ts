import { Router } from "express";
import { handleWebhook } from "../controllers/webhook.controller";

const router = Router();

router.post("/payos", handleWebhook);

export default router;
