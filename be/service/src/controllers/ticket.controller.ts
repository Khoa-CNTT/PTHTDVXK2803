import { Request, Response } from "express";
import { bookBusTicketsDB } from "../config/db";
import { errorResponse, successResponse } from "../utils/response.util";
import TicketService from "../services/ticket.service";

export class TicketController {
  private ticketService = new TicketService(bookBusTicketsDB);

  add = async (req: Request, res: Response) => {
    try {
      const formData = req.body;
      const result = await this.ticketService.add(formData);
      successResponse(res, 200, result);
    } catch (error) {
      errorResponse(res, "err add trip", 500);
    }
  };
}

export default new TicketController();
