import express from "express";
import {
  addLocationControl,
  deleteLocationControl,
  getAllLocationControl,
  updateLocationControl,
} from "../controllers/location.controller";

const route = express.Router();

route.get("/get-all", getAllLocationControl);
route.post("/add", addLocationControl);
route.put("/update", updateLocationControl);
route.delete("/delete/:id", deleteLocationControl);

export default route;
