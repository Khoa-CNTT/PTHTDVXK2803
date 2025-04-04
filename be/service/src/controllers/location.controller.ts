import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response.util";
import {
  addLocationSer,
  deleteLocationSer,
  getAllLocationSer,
  updateLocationSer,
} from "./../services/location.service";

export const addLocationControl = async (req: Request, res: Response) => {
  if (!req.body.nameLocation) return errorResponse(res, "Name location null!.", 404);
  try {
    const result = await addLocationSer(req.body.nameLocation);
    return successResponse(res, result, "Success");
  } catch (error) {
    console.error("Err Controller.addLocation: ", error);
    return res.status(404).json({
      message: "Err Controller.addLocation",
    });
  }
};

export const updateLocationControl = async (req: Request, res: Response) => {
  const { id, nameLocation } = req.body;

  if (!id || !nameLocation) return errorResponse(res, "Id or name location null!.", 404);
  try {
    const result = await updateLocationSer(Number(id), nameLocation);
    return successResponse(res, result, "Success");
  } catch (error) {
    console.error("Err Controller.updateLocation: ", error);
    return res.status(404).json({
      message: "Err Controller.updateLocation",
    });
  }
};

export const deleteLocationControl = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return errorResponse(res, "id location null!.", 404);
  try {
    const result = await deleteLocationSer(id);
    return successResponse(res, result, "Success");
  } catch (error) {
    console.error("Err Controller.deleteLocation: ", error);
    return res.status(404).json({
      message: "Err Controller.deleteLocation",
    });
  }
};

export const getAllLocationControl = async (req: Request, res: Response) => {
  try {
    const result = await getAllLocationSer();
    return successResponse(res, result, "Success");
  } catch (error) {
    console.error("Err Controller.getAllLocation: ", error);
    return res.status(404).json({
      message: "Err Controller.getAllLocation",
    });
  }
};
