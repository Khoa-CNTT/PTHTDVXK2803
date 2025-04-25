import { Request, Response } from "express";
import { bookBusTicketsDB } from "../config/db";
import { TripService } from "../services/trip.service";
import { errorResponse, successResponse } from "../utils/response.util";
export class TripController {
  private tripService = new TripService(bookBusTicketsDB);

  getFormData = async (req: Request, res: Response) => {
    try {
      const result = await this.tripService.getFormData();
      successResponse(res, 200, result);
    } catch (error) {
      errorResponse(res, "err getFormData");
      console.log("err", error);
    }
  };
}
