import { Request, Response } from "express";
import { bookBusTicketsDB } from "../config/db";
import { UserService } from "../services/user.service";
import { errorResponse, successResponse } from "../utils/response.util";
import { verifyRefreshToken } from "../services/auth.service";
import testEmail from "../utils/testEmail";

export class UserController {
  private userService = new UserService(bookBusTicketsDB);

  loginByAdmin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const isCheckEmail = testEmail(email);

      if (!email || !password) {
        res.status(200).json({
          status: "ERR",
          message: "The input is required",
        });
      }

      if (!isCheckEmail) {
        res.status(200).json({
          status: "ERR",
          message: "Email is not in correct format",
        });
      }

      const response = await this.userService.loginByAdmin(req.body);

      if (
        "access_token" in response &&
        "refresh_token" in response &&
        "expirationTime" in response
      ) {
        const { status, data, access_token, refresh_token, expirationTime } = response;
        res.cookie("access_token", access_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
          path: "/",
        });

        res.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        successResponse(res, 200, { status, data, expirationTime: expirationTime });
      } else {
        if ("message" in response) {
          errorResponse(res, response.message, 400);
        } else {
          errorResponse(res, "Unexpected error occurred", 400);
        }
      }
    } catch (err) {
      console.log(err);
      res.status(404).json({
        message: "Controller.login err",
        error: err,
      });
    }
  };

  loginByCustomer = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const isCheckEmail = testEmail(email);

      if (!email || !password) {
        errorResponse(res, "The input is required", 404);
      }

      if (!isCheckEmail) {
        errorResponse(res, "Email is not in correct format", 404);
      }

      const response = await this.userService.loginByCustomer(req.body);

      if (
        "access_token" in response &&
        "refresh_token" in response &&
        "expirationTime" in response
      ) {
        const { access_token, data, refresh_token, status, expirationTime } = response;

        res.cookie("access_token", access_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
          path: "/",
        });

        res.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        successResponse(res, 200, { status, data, expirationTime: expirationTime });
      } else {
        if ("message" in response) {
          
          errorResponse(res, response.message, 200);
        } else {
          errorResponse(res, "Unexpected error occurred", 400);
        }
      }
    } catch (err) {
      errorResponse(res, "Controller.login err", 404);
    }
  };

  loginByDriver = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const isCheckEmail = testEmail(email);

      if (!email || !password) {
        res.status(200).json({
          status: "ERR",
          message: "The input is required",
        });
      }

      if (!isCheckEmail) {
        res.status(200).json({
          status: "ERR",
          message: "Email is not in correct format",
        });
      }

      const response = await this.userService.loginByDriver(req.body);

      if (
        "access_token" in response &&
        "refresh_token" in response &&
        "expirationTime" in response
      ) {
        const { access_token, refresh_token, status, expirationTime } = response;
        res.cookie("access_token", access_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
          path: "/",
        });

        res.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        successResponse(res, 200, { status, expirationTime: expirationTime });
      } else {
        if ("message" in response) {
          errorResponse(res, response.message, 400);
        } else {
          errorResponse(res, "Unexpected error occurred", 400);
        }
      }
    } catch (err) {
      console.log(err);
      res.status(404).json({
        message: "Controller.login err",
        error: err,
      });
    }
  };

  loginByCoDriver = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const isCheckEmail = testEmail(email);

      if (!email || !password) {
        res.status(200).json({
          status: "ERR",
          message: "The input is required",
        });
      }

      if (!isCheckEmail) {
        res.status(200).json({
          status: "ERR",
          message: "Email is not in correct format",
        });
      }

      const response = await this.userService.loginByCoDriver(req.body);

      if (
        "access_token" in response &&
        "refresh_token" in response &&
        "expirationTime" in response
      ) {
        const { access_token, refresh_token, status, expirationTime } = response;
        res.cookie("access_token", access_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
          path: "/",
        });

        res.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        successResponse(res, 200, { status, expirationTime: expirationTime });
      } else {
        if ("message" in response) {
          errorResponse(res, response.message, 400);
        } else {
          errorResponse(res, "Unexpected error occurred", 400);
        }
      }
    } catch (err) {
      console.log(err);
      res.status(404).json({
        message: "Controller.login err",
        error: err,
      });
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) res.status(401).json({ message: "No refresh token provided" });

      const response = await verifyRefreshToken(refreshToken);

      if ("access_token" in response && "expirationTime" in response) {
        const { access_token, expirationTime } = response;

        res.cookie("access_token", access_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
          path: "/",
        });

        res.cookie("access_token_expiration", expirationTime.toString(), {
          httpOnly: false,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
          path: "/",
        });

        successResponse(res, 200, "");
      } else {
        errorResponse(res, response.message, 400);
      }
    } catch (error) {
      errorResponse(res, "ERR Controller.refreshToken", 404);
    }
  };

  delete = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const data = await this.userService.delete(id);
      successResponse(res, data, "Delete user success");
    } catch (error) {
      console.log("Controller", error);
      errorResponse(res, "ERR Controller.deleteUser", 404);
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      successResponse(res, 200, { status: "OK", message: "Logout success" });
    } catch (error) {
      console.log("Controller", error);
      errorResponse(res, "ERR Controller.logout", 404);
    }
  };
}
