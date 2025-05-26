import express from "express";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";
import statisticalController from "../controllers/statistical.controller";

const router = express.Router();

router.get(
  "/get-stats",
  verifyAccessToken,
  authorizeRoles("admin"),
  statisticalController.getDashboardSummary
);

export default router;
