import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response.util";
import { RequestFile } from "../middlewares/uploadHandler";
import { CloudinaryAsset } from "../@types/cloudinary";
import { ArrangeType } from "../@types/type";
import { CustomerService } from "../services/customer.service";
import { globalBookTicketsDB } from "../config/db";

export class CustomerController {
  private customerService = new CustomerService(globalBookTicketsDB);

  register = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password, confirmPassword } = req.body;
      const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      const isCheckEmail = reg.test(email);

      if (!email || !password || !confirmPassword) {
        return errorResponse(res, "The input is required", 200);
      }

      if (!isCheckEmail) {
        return errorResponse(res, "Email is not in correct format", 200);
      }

      if (password !== confirmPassword) {
        return errorResponse(res, "Password and confirm password are not the same", 200);
      }

      const data = await this.customerService.register(req.body);
      const { refresh_token, ...newData } = data;

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return successResponse(res, newData, "Register success");
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "Controller.register", 404);
    }
  };

  verifyEmail = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, otp } = req.body;
      const response = await this.customerService.verifyEmail(email, otp);
      return successResponse(res, response, "Verify email success");
    } catch (error) {
      return errorResponse(res, "ERR Controller.verifyEmail", 404);
    }
  };

  fetch = async (req: Request, res: Response): Promise<any> => {
    const id = Number(req.params.id);
    try {
      const data = await this.customerService.fetch(id);
      return successResponse(res, data, "Fetch customer success");
    } catch (error) {
      return errorResponse(res, "ERR Controller.fetch", 404);
    }
  };

  update = async (req: Request, res: Response): Promise<any> => {
    try {
      const id = Number(req.params.id);
      if (!id) return errorResponse(res, "id is required", 404);

      const updateData = req.body;
      const data = await this.customerService.update(id, updateData);
      return successResponse(res, data, "Update user success");
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.update", 404);
    }
  };

  updateImage = async (req: RequestFile, res: Response): Promise<any> => {
    try {
      const id = Number(req.body.id);
      const file = req.uploadedImage as CloudinaryAsset;
      const publicId = req.body.publicId;
      if (!id) return errorResponse(res, "id is required", 404);

      const data = await this.customerService.updateImage(id, publicId, file);
      return successResponse(res, data, "Update image success");
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.updateImage", 404);
    }
  };

  getAll = async (req: Request, res: Response): Promise<any> => {
    try {
      const limit = Number(req.query.limit) || 10;
      const offset = Number(req.query.offset);
      const arrangeType =
        (req.query.arrangeType as string)?.toUpperCase() === "ASC"
          ? "ASC"
          : ("DESC" as ArrangeType);

      if (limit < 0 || offset < 0)
        return errorResponse(res, "limit and offset must be greater than 0", 404);

      const data = await this.customerService.getAll(limit, offset, arrangeType);
      return successResponse(res, data, "Get all customers success");
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.getAll", 404);
    }
  };

  create = async (req: RequestFile, res: Response): Promise<any> => {
    try {
      const file = req.uploadedImage as CloudinaryAsset;
      const newCustomer = JSON.parse(req.body.data);
      const data = await this.customerService.add(newCustomer, file);
      return successResponse(res, data, "Create customer success");
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.create", 404);
    }
  };
}
