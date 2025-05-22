import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response.util";
import { RequestFile } from "../middlewares/uploadHandler";
import { CloudinaryAsset } from "../@types/cloudinary";
import { ArrangeType } from "../@types/type";
import { bookBusTicketsDB } from "../config/db";
import { CoDriverService } from "../services/coDriver.service";

export class CoDriverController {
  private coDriverService = new CoDriverService(bookBusTicketsDB);

  fetch = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await this.coDriverService.fetch(id);
      if (data.status === "ERR") {
        errorResponse(res, data.message, 404);
      }
      successResponse(res, 200, data);
    } catch (error) {
      errorResponse(res, "ERR Controller.fetch", 404);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!id) errorResponse(res, "id is required", 404);

      const updateData = req.body;
      const data = await this.coDriverService.update(id, updateData);
      if (data.status === "ERR") {
        errorResponse(res, data.message, 404);
      }
      successResponse(res, 200, data);
    } catch (error) {
      console.log("Err Controller", error);
      errorResponse(res, "ERR Controller.update", 404);
    }
  };

  updateImage = async (req: RequestFile, res: Response) => {
    try {
      const id = Number(req.body.id);
      const file = req.uploadedImage as CloudinaryAsset;
      const publicId = req.body.publicId;
      
      if (!id) errorResponse(res, "id is required", 404);

      const data = await this.coDriverService.updateImage(id, publicId, file);
      if (data.status === "ERR") {
        errorResponse(res, data.message, 404);
      }
      successResponse(res, 200, data);
    } catch (error) {
      console.log("Err Controller", error);
      errorResponse(res, "ERR Controller.updateImage", 404);
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const phoneSearch = (req.query.phone as string) || "";
      const limit = Number(req.query.limit) || 10;
      const offset = Number(req.query.offset);
      const arrangeType =
        (req.query.arrangeType as string)?.toUpperCase() === "ASC"
          ? "ASC"
          : ("DESC" as ArrangeType);

      if (limit < 0 || offset < 0)
        errorResponse(res, "limit and offset must be greater than 0", 404);

      const data = await this.coDriverService.getAll(limit, offset, arrangeType, phoneSearch);
      successResponse(res, 200, data);
    } catch (error) {
      console.log("Err Controller", error);
      errorResponse(res, "ERR Controller.getAll", 404);
    }
  };

  create = async (req: RequestFile, res: Response) => {
    try {

      const file = req.uploadedImage as CloudinaryAsset;
      const dataNewCoDriver = JSON.parse(req.body.data);
      const data = await this.coDriverService.add(dataNewCoDriver, file);
      if (data.status === "ERR") {
        errorResponse(res, data.message, 404);
      }
      successResponse(res, 200, data);
    } catch (error) {
      console.log("Err Controller", error);
      errorResponse(res, "ERR Controller.create", 404);
    }
  };
}
