import express from "express";

import { UserController } from "../controllers/user.controller";

const router = express.Router();
const userController = new UserController();

router.post("/auth/login", userController.login);
router.post("/auth/logout", userController.logout);
router.get("/auth/refresh-token", userController.refreshToken);

export default router;
