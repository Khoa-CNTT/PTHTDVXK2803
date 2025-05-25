import express from "express";

import {
  uploadImages,
  uploadImagesToCloudinary,
  uploadImageToCloudinary,
} from "../middlewares/uploadHandler";
import { uploadImage } from "../middlewares/multerConfig";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { CarController } from "../controllers/car.controller";

const carRouter = express.Router();
const carController = new CarController();

carRouter.post(
  "/add",
  verifyAccessToken,
  authorizeRoles("admin"),
  // validateCreateCar,
  // validateCreateCarMiddleware,
  uploadImages,
  uploadImagesToCloudinary,
  carController.addCar
);
carRouter.put(
  "/update",
  verifyAccessToken,
  authorizeRoles("admin"),
  // validateUpdateCar,
  // validateUpdateCarMiddleware,
  uploadImages,
  uploadImagesToCloudinary,
  carController.updateCar
);
carRouter.put(
  "/image/update",
  verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  carController.updateImgCar
);
carRouter.delete(
  "/image/delete",
  verifyAccessToken,
  authorizeRoles("admin"),
  carController.deleteImgCar
);
carRouter.delete(
  "/delete/:id",
  verifyAccessToken,
  authorizeRoles("admin"),
  carController.deleteCar
);
carRouter.get("/get-all", verifyAccessToken, authorizeRoles("admin"), carController.getAllCar);

carRouter.get(
  "/detail/:licensePlate",
  verifyAccessToken,
  authorizeRoles("admin", "customer"),
  carController.getCarByLicensePlate
);

// carRouter.get("/get", async (req, res) => {
//   try {
//     const client = await pool.connect();
//     const result = await client.query("SELECT NOW()"); // Kiểm tra kết nối bằng truy vấn thời gian hiện tại
//     client.release();

//     res.json({
//       message: "Connected to PostgreSQL!",
//       serverTime: result.rows[0].now,
//     });
//   } catch (err) {
//     console.error("Connection error:", err);
//     res.status(500).json({ message: "Database connection failed", error: err });
//   }
// });

export default carRouter;
