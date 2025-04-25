import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response.util";
import { RequestFile } from "../middlewares/uploadHandler";
import { CloudinaryAsset } from "../@types/cloudinary";
import { ArrangeType } from "../@types/type";
import { CustomerService } from "../services/customer.service";
import { bookBusTicketsDB } from "../config/db";

export class CustomerController {
  private customerService = new CustomerService(bookBusTicketsDB);

  register = async (req: Request, res: Response) => {
    try {
      const { email, password, confirmPassword } = req.body;
      const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      const isCheckEmail = reg.test(email);

      if (!email || !password || !confirmPassword) {
        errorResponse(res, "The input is required", 200);
      }

      if (!isCheckEmail) {
        errorResponse(res, "Email is not in correct format", 200);
      }

      if (password !== confirmPassword) {
        errorResponse(res, "Password and confirm password are not the same", 200);
      }

      const data = await this.customerService.register(req.body);
      const { refresh_token, ...newData } = data;

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      successResponse(res, newData, "Register success");
    } catch (error) {
      console.log("Err Controller", error);
      errorResponse(res, "Controller.register", 404);
    }
  };

  verifyEmail = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const response = await this.customerService.verifyEmail(email, otp);
      successResponse(res, response, "Verify email success");
    } catch (error) {
      errorResponse(res, "ERR Controller.verifyEmail", 404);
    }
  };

  fetch = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const result = await this.customerService.fetch(id);
      successResponse(res, 200, result);
    } catch (error) {
      errorResponse(res, "ERR Controller.fetch", 404);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!id) errorResponse(res, "id is required", 404);

      const updateData = req.body;
      const result = await this.customerService.update(id, updateData);
      successResponse(res, 200, result);
    } catch (error) {
      console.log("Err Controller", error);
      errorResponse(res, "ERR Controller.update", 404);
    }
  };

  updateImage = async (req: RequestFile, res: Response) => {
    try {
      const id = Number(req.body.id);
      const file = req.uploadedImage as CloudinaryAsset;
      const publicId = req.body.publicId;
      if (!id) errorResponse(res, "id is required", 404);

      const result = await this.customerService.updateImage(id, publicId, file);
      successResponse(res, 200, result);
    } catch (error) {
      console.log("Err Controller", error);
      errorResponse(res, "ERR Controller.updateImage", 404);
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

      const result = await this.customerService.getAll(limit, offset, arrangeType);
      successResponse(res, 200, result);
    } catch (error) {
      console.log("Err Controller", error);
      errorResponse(res, "ERR Controller.getAll", 404);
    }
  };

  create = async (req: RequestFile, res: Response) => {
    try {
      const file = req.uploadedImage as CloudinaryAsset;
      const newCustomer = JSON.parse(req.body.data);
      const result = await this.customerService.add(newCustomer, file);
      successResponse(res, 200, result);
    } catch (error) {
      console.log("Err Controller", error);
      errorResponse(res, "ERR Controller.create", 404);
    }
  };
}
