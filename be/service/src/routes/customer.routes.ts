import express from "express";

import { uploadImageToCloudinary } from "../middlewares/uploadHandler";
import { uploadImage } from "../middlewares/multerConfig";
import { CustomerController } from "../controllers/customer.controller";
import { UserController } from "../controllers/user.controller";

const router = express.Router();
const customerController = new CustomerController();
const userController = new UserController();

router.get("/get-all", customerController.getAll);
router.get("/get-detail/:id", customerController.fetch);
router.post("/create", uploadImage, uploadImageToCloudinary, customerController.create);
router.put("/update-info/:id", customerController.update);
router.put("/update-img", uploadImage, uploadImageToCloudinary, customerController.updateImage);
router.delete("/delete/:id", userController.delete);

export default router;
