import express from "express";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";
import revenueController from "../controllers/revenue.controller";

const router = express.Router();

router.get(
  "/get-hour",
  verifyAccessToken,
  authorizeRoles("admin"),
  revenueController.getHourlyRevenue
);

router.get(
  "/get-month",
  verifyAccessToken,
  authorizeRoles("admin"),
  revenueController.getMonthlyRevenue
);

router.get(
  "/get-year",
  verifyAccessToken,
  authorizeRoles("admin"),
  revenueController.getYearlyRevenue
);

export default router;
