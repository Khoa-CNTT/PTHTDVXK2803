import express from "express";

import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { LocationController } from "../controllers/location.controller";

const locationController = new LocationController();

const route = express.Router();

route.get("/get-all", locationController.getAll);
route.post("/add", verifyAccessToken, authorizeRoles("admin"), locationController.add);
route.delete("/delete/:id", verifyAccessToken, authorizeRoles("admin"), locationController.delete);

export default route;
