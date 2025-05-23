import express from "express";
import { CoDriverController } from "../controllers/coDriver.controller";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { uploadImage } from "../middlewares/multerConfig";
import { uploadImageToCloudinary } from "../middlewares/uploadHandler";

const route = express.Router();
const coDriverController = new CoDriverController();

route.post(
  "/create",
  verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  coDriverController.create
);
route.put(
  "/update-info/:id",
  verifyAccessToken,
  authorizeRoles("admin"),
  coDriverController.update
);
route.put(
  "/update-img",
  verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  coDriverController.updateImage
);
route.get(
  "/get-all",
  // verifyAccessToken, authorizeRoles("admin"),
  coDriverController.getAll
);
route.get(
  "/get-detail/:id",
  // verifyAccessToken, authorizeRoles("admin"),
  coDriverController.fetch
);

export default route;
