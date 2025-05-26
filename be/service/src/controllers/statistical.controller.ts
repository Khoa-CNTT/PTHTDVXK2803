import { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/response.util";
import StatisticalService from "../services/statistical.service";
import { bookBusTicketsDB } from "../config/db";

const statisticalService = new StatisticalService(bookBusTicketsDB);

class StatisticalController {
  async getDashboardSummary(req: Request, res: Response): Promise<void> {
    try {
      const response = await statisticalService.getDashboardSummary();
      if (response.status === "ERR") {
        errorResponse(res, response.message, 500);
      } else {
      }
      successResponse(res, 200, response.data);
    } catch (error) {
      console.error("Dashboard error:", error);
      errorResponse(res, "Err system", 500);
    }
  }
}

export default new StatisticalController();
