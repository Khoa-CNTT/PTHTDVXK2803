import express from "express";
import { AdminController } from "../controllers/admin.controller";
import { verifyAccessToken } from "../utils/jwt.util";
import { authorizeRoles } from "../middlewares/auth.middleware";

const route = express.Router();
const adminController = new AdminController();

route.post("/create", verifyAccessToken, authorizeRoles("admin"), adminController.create);
route.put("/update", verifyAccessToken, authorizeRoles("admin"), adminController.update);
route.get("/get-all", verifyAccessToken, authorizeRoles("admin"), adminController.getAll);
route.get("/fetch", verifyAccessToken, authorizeRoles("admin"), adminController.fetch);

export default route;
