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

  getDetailTicket = async (req: Request, res: Response) => {
    const { phone, idTicket } = req.body;
    try {
      const result = await this.ticketService.getDetailTicket({ phone, idTicket });
      successResponse(res, 200, result);
    } catch (error) {
      errorResponse(res, "ERR Controller.getDetailTicket", 404);
    }
  };

  getDetailTicketByEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
      const result = await this.ticketService.getDetailTicketByEmail(email);
      successResponse(res, 200, result);
    } catch (error) {
      errorResponse(res, "ERR Controller.getDetailTicket", 404);
    }
  };

  deleteById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) errorResponse(res, "Id not invalid", 404);
      const response = await this.ticketService.deleteById(Number(id));
      if (response.status === "ERR") {
        errorResponse(res, response.message);
      } else {
        successResponse(res, 200, response);
      }
    } catch (error) {
      errorResponse(res, "ERR Controller.getDetailTicket", 404);
    }
  };
}

export default new TicketController();
