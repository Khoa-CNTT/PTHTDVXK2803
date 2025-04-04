import { Request, Response } from "express";
import {
  addCarSer,
  addImgCar,
  deleteCarSer,
  deleteImgCarSer,
  getAllCarSer,
  getCarByIdSer,
  getCarByLicensePlateSer,
  getCarByStatusSer,
  getCarByTypeAndStatusSer,
  getCarByTypeSer,
  updateCarSer,
  updateImgCarSer,
} from "../services/car.service";
import { errorResponse, successResponse } from "../utils/response.util";
import { CarRequest, RequestWithCar, statusMap, typeMap } from "../@types/car.type";
import { decode } from "punycode";
import { CloudinaryAsset } from "../@types/cloudinary";
import { RequestFile, RequestWithProcessedFiles } from "../middlewares/uploadHandler";

export const addCarCTL = async (req: RequestWithProcessedFiles, res: Response): Promise<any> => {
  const data = JSON.parse(req.body.data);
  const resultCloudinary = req.processedFiles;
  try {
    const result = await addCarSer(data, resultCloudinary);
    return successResponse(res, result, "Car create successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateCarCTL = async (req: RequestWithProcessedFiles, res: Response): Promise<any> => {
  const data = JSON.parse(req.body.data);
  const resultCloudinary = req.processedFiles;
  try {
    const result = await updateCarSer(data, resultCloudinary);
    return successResponse(res, result, "Car update successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

export const deleteCarCTL = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);
    const result = await deleteCarSer(id);
    return successResponse(res, result, "Car delete successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

export const getAllCarCTL = async (req: Request, res: Response): Promise<any> => {
  try {
    let { limit, offset } = req.query;
    const pageLimit = parseInt(limit as string) || 5;
    const pageOffset = parseInt(offset as string) || 0;
    const result = await getAllCarSer(pageLimit, pageOffset);
    return successResponse(res, result, "Car get all successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

export const getCarByIdCTL = async (req: Request, res: Response): Promise<any> => {
  const id = Number(req.params.id);
  try {
    if (id === 0) return successResponse(res, null, "Car Id not exist!");
    const result = await getCarByIdSer(id);
    return successResponse(res, result, "Car get by id successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

export const getCarByLicensePlateCTL = async (req: Request, res: Response): Promise<any> => {
  const licensePlate = req.params.licensePlate;
  try {
    const result = await getCarByLicensePlateSer(licensePlate);
    return successResponse(res, result, "Car get by license plate successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

export const getCarByTypeCTL = async (req: Request, res: Express.Response): Promise<any> => {
  if (!req.params.type || !typeMap[req.params.type]) {
    return errorResponse(res, "Invalid car type", 400);
  }
  try {
    const type = typeMap[req.params.type];
    const result = await getCarByTypeSer(type);
    return successResponse(res, result, "Car get by type successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

export const getCarByStatusCTL = async (req: Request, res: Express.Response): Promise<any> => {
  if (!req.params.status || !statusMap[req.params.status]) {
    return errorResponse(res, "Invalid car status", 400);
  }
  try {
    const status = statusMap[req.params.status];
    const result = await getCarByStatusSer(status);
    return successResponse(res, result, "Car get by status successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

export const getCarByTypeAndStatusCTL = async (
  req: RequestWithCar,
  res: Express.Response
): Promise<any> => {
  if (
    !req.params.type ||
    !req.params.status ||
    !typeMap[req.params.type] ||
    !statusMap[req.params.status]
  ) {
    return errorResponse(res, "Invalid car type or status", 400);
  }
  try {
    const type = typeMap[req.params.type];
    const status = statusMap[req.params.status];

    const result = await getCarByTypeAndStatusSer(type, status);
    return successResponse(res, result, "Car get by type and status successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
//
export const addImgCarCTL = async (req: RequestWithProcessedFiles, res: Response) => {
  const data = JSON.parse(req.body.data);
  const resultCloudinary = req.processedFiles;
  try {
    const result = await addImgCar(data, resultCloudinary);
    return successResponse(res, result, "Add Image Car successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

export const updateImgCarCTL = async (req: RequestFile, res: Response) => {
  const data = JSON.parse(req.body.data);
  const resultCloudinary = req.uploadedImage;
  console.log(resultCloudinary);
  try {
    const result = await updateImgCarSer(data, resultCloudinary);
    return successResponse(res, result, "Update Image Car successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

export const deleteImgCarCTL = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const result = await deleteImgCarSer(data);
    return successResponse(res, result, "Delete Image Car successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
