import { authorizeRoles } from "../middlewares/auth.middleware";
import { verifyAccessToken } from "../services/auth.service";
import { TripController } from "./../controllers/trip.controller";
import express from "express";

const router = express.Router();
const tripController = new TripController();

router.get("/form-data", verifyAccessToken, authorizeRoles("admin"), tripController.getFormData);
router.post("/add", verifyAccessToken, authorizeRoles("admin"), tripController.add);
router.get("/get-all", verifyAccessToken, authorizeRoles("admin"), tripController.getAll);

export default router;
