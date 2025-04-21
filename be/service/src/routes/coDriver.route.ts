import express from "express";
import { CoDriverController } from "../controllers/coDriver.controller";
import { verifyAccessToken } from "../utils/jwt.util";
import { authorizeRoles } from "../middlewares/auth.middleware";

const route = express.Router();
const coDriverController = new CoDriverController();

route.post("/create", verifyAccessToken, authorizeRoles("admin"), coDriverController.create);
route.put("/update", verifyAccessToken, authorizeRoles("admin"), coDriverController.update);
route.get("/get-all", verifyAccessToken, authorizeRoles("admin"), coDriverController.getAll);
route.get("/fetch", verifyAccessToken, authorizeRoles("admin"), coDriverController.fetch);

export default route;
