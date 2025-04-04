import express from "express";
import {
  cancelPaymentCTL,
  createPaymentCTL,
  getPaymentLinkCTL,
} from "../controllers/payos.controller";
const router = express.Router();

router.post("/create-payment", createPaymentCTL);
router.post("/get-payment-link", getPaymentLinkCTL);
router.post("/cancel-payment-link", cancelPaymentCTL);

export default router;
