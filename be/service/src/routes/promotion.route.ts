import express from "express";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";
import PromotionController from "../controllers/promotion.controller";

const route = express.Router();
const promotionController = new PromotionController();

route.post("/create", verifyAccessToken, authorizeRoles("admin"), promotionController.create);
route.put("/update/:id", verifyAccessToken, authorizeRoles("admin"), promotionController.update);
route.get("/get-all", verifyAccessToken, authorizeRoles("admin"), promotionController.getAll);
route.get(
  "/get-detail-by-code/:code",
  verifyAccessToken,
  authorizeRoles("admin"),
  promotionController.fetchByCode
);
route.get(
  "/get-detail-by-id/:id",
  verifyAccessToken,
  authorizeRoles("admin"),
  promotionController.fetchById
);
route.delete(
  "/delete/:code",
  verifyAccessToken,
  authorizeRoles("admin"),
  promotionController.delete
);

export default route;
