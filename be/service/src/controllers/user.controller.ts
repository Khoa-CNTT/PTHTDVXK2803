import { Request, Response } from "express";
import { globalBookTicketsDB } from "../config/db";
import { UserService } from "../services/user.service";
import { errorResponse, successResponse } from "../utils/response.util";
import { verifyRefreshToken } from "../utils/jwt.util";

export class UserController {
  private userService = new UserService(globalBookTicketsDB);

  login = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password } = req.body;
      const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      const isCheckEmail = reg.test(email);

      if (!email || !password) {
        return res.status(200).json({
          status: "ERR",
          message: "The input is required",
        });
      }

      if (!isCheckEmail) {
        return res.status(200).json({
          status: "ERR",
          message: "Email is not in correct format",
        });
      }

      const response = await this.userService.login(req.body);
      const { refresh_token, ...newData } = response;

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json(newData);
    } catch (err) {
      console.log(err);
      return res.status(404).json({
        message: "Controller.login err",
        error: err,
      });
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<any> => {
    try {
      const token = req.headers.token?.toString().split(" ")[1];
      if (!token) {
        return errorResponse(res, "Token is not defined", 200);
      }

      const data = await verifyRefreshToken(token);
      const { refresh_token, ...newData } = data;

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return successResponse(res, newData, "Refresh token success");
    } catch (error) {
      console.log("err refresh token", error);
      return errorResponse(res, "ERR Controller.refreshToken", 404);
    }
  };

  delete = async (req: Request, res: Response): Promise<any> => {
    const id = Number(req.params.id);
    try {
      const data = await this.userService.delete(id);
      return successResponse(res, data, "Delete user success");
    } catch (error) {
      console.log("Controller", error);
      return errorResponse(res, "ERR Controller.deleteUser", 404);
    }
  };
}
