import { TripController } from "./../controllers/trip.controller";
import express from "express";

const router = express.Router();
const tripController = new TripController();

router.get("/form-data", tripController.getFormData);

export default router;
