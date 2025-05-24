import express from "express";

import { UserController } from "../controllers/user.controller";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";

const router = express.Router();
const userController = new UserController();

router.post("/auth/admin/login", userController.loginByAdmin);
router.post("/auth/customer/login", userController.loginByCustomer);
router.post("/auth/driver/login", userController.loginByDriver);
router.post("/auth/co-driver/login", userController.loginByCoDriver);
router.post("/auth/logout", userController.logout);
router.get("/auth/refresh-token", userController.refreshToken);

export default router;
