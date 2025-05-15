import express from "express";

import { uploadImageToCloudinary } from "../middlewares/uploadHandler";
import { uploadImage } from "../middlewares/multerConfig";
import { CustomerController } from "../controllers/customer.controller";
import { UserController } from "../controllers/user.controller";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";

const router = express.Router();
const customerController = new CustomerController();
const userController = new UserController();

router.post("/register", customerController.register);
router.post("/verify-email", customerController.verifyEmail);
router.get("/get-all", verifyAccessToken, authorizeRoles("admin"), customerController.getAll);
router.get("/get-detail/:id", verifyAccessToken, authorizeRoles("admin"), customerController.fetch);
router.post(
  "/create",
  verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  customerController.create
);
router.put(
  "/update-info/:id",
  verifyAccessToken,
  authorizeRoles("admin"),
  customerController.update
);
router.put(
  "/update-img",
  verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  customerController.updateImage
);
router.delete("/delete/:id", verifyAccessToken, authorizeRoles("admin"), userController.delete);

export default router;
