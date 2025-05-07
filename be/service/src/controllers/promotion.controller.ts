import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response.util";
import { PromotionService } from "../services/promotion.service";
import { bookBusTicketsDB } from "../config/db";
import { ArrangeType } from "../@types/type";

class PromotionController {
  private promotionService = new PromotionService(bookBusTicketsDB);

  fetchByCode = async (req: Request, res: Response) => {
    try {
      const code = req.params.code;
      const data = await this.promotionService.getByCode(code);
      if (data.status === "ERR") {
        errorResponse(res, data.message, 404);
      }
      successResponse(res, 200, data.data);
    } catch (error) {
      console.log("Err Controller.fetch", error);
      errorResponse(res, "ERR Controller.fetch", 404);
    }
  };

  fetchById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!id) errorResponse(res, "id is required", 404);
      const data = await this.promotionService.getById(id);
      if (data.status === "ERR") {
        errorResponse(res, data.message, 404);
      }
      successResponse(res, 200, data.data);
    } catch (error) {
      console.log("Err Controller.fetch", error);
      errorResponse(res, "ERR Controller.fetch", 404);
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
      const code = req.query.code as string;
      const type =
        req.query.type === "percentage"
          ? "percentage"
          : req.query.type === "fixed"
          ? "fixed"
          : "all";
      const carTypes = req.query.carTypes ? (req.query.carTypes as string) : "all";

      if (limit < 0 || offset < 0)
        errorResponse(res, "limit and offset must be greater than 0", 404);

      const data = await this.promotionService.getAll(
        limit,
        offset,
        arrangeType,
        code,
        type,
        carTypes
      );

      successResponse(res, 200, data);
    } catch (error) {
      console.log("Err Controller.getAll", error);
      errorResponse(res, "ERR Controller.getAll", 404);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const promotion = req.body;
      const data = await this.promotionService.add(promotion);
      if (data.status === "ERR") {
        errorResponse(res, data.message, 404);
      }
      successResponse(res, 200, data);
    } catch (error) {
      console.log("Err Controller.create", error);
      errorResponse(res, "ERR Controller.create", 404);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!id) errorResponse(res, "id is required", 404);

      const promotion = req.body;
      const data = await this.promotionService.update(id, promotion);
      if (data.status === "ERR") {
        errorResponse(res, data.message, 404);
      }
      successResponse(res, 200, data);
    } catch (error) {
      console.log("Err Controller.update", error);
      errorResponse(res, "ERR Controller.update", 404);
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const code = req.params.code;
      const data = await this.promotionService.deleteByCode(code);
      if (data.status === "ERR") {
        errorResponse(res, data.message, 404);
      }
      successResponse(res, 200, data);
    } catch (error) {
      console.log("Err Controller.delete", error);
      errorResponse(res, "ERR Controller.delete", 404);
    }
  };
}

export default PromotionController;
