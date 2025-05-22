import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response.util";
import { LocationService } from "../services/location.service";
import { bookBusTicketsDB } from "../config/db";

export class LocationController {
  private locationService = new LocationService(bookBusTicketsDB);
  add = async (req: Request, res: Response) => {
    try {
      const response = await this.locationService.add(req.body.newValue);
      successResponse(res, 200, response);
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  };

  delete = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id) errorResponse(res, "Id location null!.", 404);

    try {
      const response = await this.locationService.delete(id);
      successResponse(res, 200, response);
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      
      const response = await this.locationService.getAll();
      if (response.status === "ERR") {
        errorResponse(res, response.message, 404);
      }
      successResponse(res, 200, response.data);
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  };
}
