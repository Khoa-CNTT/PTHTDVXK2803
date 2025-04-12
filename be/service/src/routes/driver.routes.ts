import express from "express";

import { uploadImageToCloudinary } from "../middlewares/uploadHandler";
import { uploadImage } from "../middlewares/multerConfig";
import { UserController } from "../controllers/user.controller";
import { DriverController } from "../controllers/driver.controller";

const router = express.Router();
const driverController = new DriverController();
const userController = new UserController();

router.get("/get-all", driverController.getAll);
router.get("/get-detail/:id", driverController.fetch);
router.post("/create", uploadImage, uploadImageToCloudinary, driverController.create);
router.put("/update-info/:id", driverController.update);
router.put("/update-img", uploadImage, uploadImageToCloudinary, driverController.updateImage);
router.delete("/delete/:id", userController.delete);

export default router;
