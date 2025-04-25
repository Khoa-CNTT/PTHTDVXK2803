import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response.util";
import {
  addLocationSer,
  deleteLocationSer,
  getAllLocationSer,
  updateLocationSer,
} from "./../services/location.service";

export const addLocationControl = async (req: Request, res: Response) => {
  if (!req.body.nameLocation) errorResponse(res, "Name location null!.", 404);
  try {
    const response = await addLocationSer(req.body.nameLocation);
    successResponse(res, 200, response);
  } catch (error) {
    errorResponse(error.message, "Err Controller.addLocation", 500);
  }
};

export const updateLocationControl = async (req: Request, res: Response) => {
  const { id, nameLocation } = req.body;

  if (!id || !nameLocation) errorResponse(res, "Id or name location null!.", 404);
  try {
    const response = await updateLocationSer(Number(id), nameLocation);
    successResponse(res, 200, response);
  } catch (error) {
    errorResponse(error.message, "Err Controller.upload", 500);
  }
};

export const deleteLocationControl = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) errorResponse(res, "id location null!.", 404);
  try {
    const response = await deleteLocationSer(id);
    successResponse(res, 200, response);
  } catch (error) {
    errorResponse(error.message, "Err Controller.delete", 500);
  }
};

export const getAllLocationControl = async (req: Request, res: Response) => {
  try {
    const response = await getAllLocationSer();
    successResponse(res, 200, response);
  } catch (error) {
    errorResponse(error.message, "Err Controller.getLocations", 500);
  }
};
