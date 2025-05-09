import express from "express";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { AdminController } from "../controllers/admin.controller";

const route = express.Router();
const adminController = new AdminController();

route.post("/create", verifyAccessToken, authorizeRoles("admin"), adminController.create);
route.put("/update/:id", verifyAccessToken, authorizeRoles("admin"), adminController.update);
route.get("/get-all", verifyAccessToken, authorizeRoles("admin"), adminController.getAll);
route.get("/get-detail/:id", verifyAccessToken, authorizeRoles("admin"), adminController.fetch);

export default route;
