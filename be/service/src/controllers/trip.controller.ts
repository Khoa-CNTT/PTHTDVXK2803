import { Request, Response } from "express";
import { bookBusTicketsDB } from "../config/db";
import TripService from "../services/trip.service";
import { errorResponse, successResponse } from "../utils/response.util";
import { ArrangeType } from "../@types/type";
export class TripController {
  private tripService = new TripService(bookBusTicketsDB);

  getFormData = async (req: Request, res: Response) => {
    try {
      const result = await this.tripService.getFormData();
      successResponse(res, 200, result);
    } catch (error) {
      console.log("err", error);
      errorResponse(res, "err getFormData", 500);
    }
  };

  add = async (req: Request, res: Response) => {
    try {
      const { form, seats } = req.body;
      const result = await this.tripService.add(form, seats);
      successResponse(res, 200, result);
    } catch (error) {
      console.log("err", error);
      errorResponse(res, "err add trip", 500);
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const licensePlateSearch = (req.query.license_plate as string) || "";
      const limit = Number(req.query.limit) || 10;
      const offset = Number(req.query.offset);
      const arrangeType =
        (req.query.arrangeType as string)?.toUpperCase() === "ASC"
          ? "ASC"
          : ("DESC" as ArrangeType);

      if (limit < 0 || offset < 0)
        errorResponse(res, "limit and offset must be greater than 0", 404);

      const result = await this.tripService.getAll(limit, offset, arrangeType, licensePlateSearch);
      successResponse(res, 200, result);
    } catch (error) {
      console.log("Err Controller", error);
      errorResponse(res, "ERR Controller.getAll", 404);
    }
  };

  fetch = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!id) errorResponse(res, "Id invalid", 404);
      const result = await this.tripService.fetch(id);
      successResponse(res, 200, result);
    } catch (error) {
      console.log("err", error);
      errorResponse(res, "err fetch trip", 500);
    }
  };
}
