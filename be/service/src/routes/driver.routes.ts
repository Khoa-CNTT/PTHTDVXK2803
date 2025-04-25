import express from "express";

import { uploadImageToCloudinary } from "../middlewares/uploadHandler";
import { uploadImage } from "../middlewares/multerConfig";
import { UserController } from "../controllers/user.controller";
import { DriverController } from "../controllers/driver.controller";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";

const router = express.Router();
const driverController = new DriverController();
const userController = new UserController();

router.get("/get-all", verifyAccessToken, authorizeRoles("admin"), driverController.getAll);
router.get("/get-detail/:id", verifyAccessToken, authorizeRoles("admin"), driverController.fetch);
router.post(
  "/create",
  verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  driverController.create
);
router.put("/update-info/:id", verifyAccessToken, authorizeRoles("admin"), driverController.update);
router.put(
  "/update-img",
  verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  driverController.updateImage
);
router.delete("/delete/:id", verifyAccessToken, authorizeRoles("admin"), userController.delete);

export default router;
