import express from "express";
import { verifyAccessTokenOfClient } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";
import payosController from "../controllers/payos.controller";
const router = express.Router();

router.post(
  "/create-payment",
  verifyAccessTokenOfClient,
  authorizeRoles("admin", "customer"),
  payosController.createPayment
);
router.post(
  "/get-payment-link",
  verifyAccessTokenOfClient,
  authorizeRoles("admin", "customer"),
  payosController.getPaymentLink
);
router.post(
  "/cancel-payment-link",
  verifyAccessTokenOfClient,
  authorizeRoles("admin", "customer"),
  payosController.cancelPayment
);

export default router;
