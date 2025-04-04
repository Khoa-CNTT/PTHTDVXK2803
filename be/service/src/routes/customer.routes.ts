import express from "express";
import {
  refreshToken,
  getAllCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  fetchCustomerControl,
} from "../controllers/customer.controller";
import { uploadImages, uploadImagesToCloudinary } from "../middlewares/uploadHandler";

const router = express.Router();

router.post("/login-google");
router.post("/refresh-token", refreshToken);
router.get("/get-all", getAllCustomer);
router.get("/get-detail/:id", fetchCustomerControl);
router.post("/add", uploadImages, uploadImagesToCloudinary, createCustomer);
router.put("/update/:id", uploadImages, uploadImagesToCloudinary, updateCustomer);
router.delete("/delete/:id", deleteCustomer);

export default router;
