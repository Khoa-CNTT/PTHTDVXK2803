import { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/response.util";
import RevenueService from "../services/revenue.service";
import { bookBusTicketsDB } from "../config/db";

const revenueService = new RevenueService(bookBusTicketsDB);

class RevenueController {
  getHourlyRevenue = async (req: Request, res: Response): Promise<void> => {
    try {
      const dateRange = (req.query.period as string) || "today";

      const response = await revenueService.getHourlyRevenue(dateRange);
      if (response.status === "ERR") {
        errorResponse(res, response.message, 500);
      }
      successResponse(res, 200, response.data);
    } catch (error) {
      errorResponse(res, "Err system", 500);
    }
  };

  getMonthlyRevenue = async (req: Request, res: Response): Promise<void> => {
    try {
      const monthRange =
        Number(req.query.period) || Number(new Date().toISOString().split("T")[0].split("-")[1]);

      const response = await revenueService.getMonthRevenue(monthRange);
      if (response.status === "ERR") {
        errorResponse(res, response.message, 500);
      }
      successResponse(res, 200, response.data);
    } catch (error) {
      console.log("err getMonthlyRevenue", error);
      errorResponse(res, "Err system", 500);
    }
  };

  getYearlyRevenue = async (req: Request, res: Response): Promise<void> => {
    try {
      const yearRange =
        Number(req.query.period) || Number(new Date().toISOString().split("T")[0].split("-")[0]);

      const response = await revenueService.getYearRevenue(yearRange);
      if (response.status === "ERR") {
        errorResponse(res, response.message, 500);
      }
      successResponse(res, 200, response.data);
    } catch (error) {
      console.log("err getYearRevenue", error);
      errorResponse(res, "Err system", 500);
    }
  };
}

export default new RevenueController();
