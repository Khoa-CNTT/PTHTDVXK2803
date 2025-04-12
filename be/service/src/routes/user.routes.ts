import express from "express";

import { UserController } from "../controllers/user.controller";

const router = express.Router();
const userController = new UserController();

router.post("/login", userController.login);
router.get("refresh-token", userController.refreshToken);

export default router;
