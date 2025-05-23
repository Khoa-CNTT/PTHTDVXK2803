import express from "express";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";
import payosController from "../controllers/payos.controller";
const router = express.Router();

router.post(
  "/create-payment",
  verifyAccessToken,
  authorizeRoles("admin", "customer"),
  payosController.createPayment
);
router.post(
  "/get-payment-link",
  verifyAccessToken,
  authorizeRoles("admin", "customer"),
  payosController.getPaymentLink
);
router.post(
  "/cancel-payment-link",
  verifyAccessToken,
  authorizeRoles("admin", "customer"),
  payosController.cancelPayment
);

export default router;
