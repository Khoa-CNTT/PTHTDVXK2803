import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response.util";
import { ArrangeType } from "../@types/type";
import { bookBusTicketsDB } from "../config/db";
import { AdminService } from "../services/admin.service";

export class AdminController {
  private adminService = new AdminService(bookBusTicketsDB);

  fetch = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await this.adminService.fetch(id);
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
      const data = await this.adminService.update(id, updateData);
      successResponse(res, 200, data);
    } catch (error) {
      console.log("Err Controller", error);
      errorResponse(res, "ERR Controller.update", 404);
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit) || 10;
      const offset = Number(req.query.offset);
      const arrangeType =
        (req.query.arrangeType as string)?.toUpperCase() === "ASC"
          ? "ASC"
          : ("DESC" as ArrangeType);

      if (limit < 0 || offset < 0)
        errorResponse(res, "limit and offset must be greater than 0", 404);

      const data = await this.adminService.getAll(limit, offset, arrangeType);
      successResponse(res, 200, data);
    } catch (error) {
      console.log("Err Controller", error);
      errorResponse(res, "ERR Controller.getAll", 404);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const dataNewAdmin = req.body;
      const data = await this.adminService.add(dataNewAdmin);
      successResponse(res, 200, data);
    } catch (error) {
      console.log("Err Controller", error);
      errorResponse(res, "ERR Controller.create", 404);
    }
  };
}
