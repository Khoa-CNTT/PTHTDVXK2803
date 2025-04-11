import { Request, Response } from "express";
import {
  addCustomerSer,
  deleteCustomerSer,
  fetchCustomerSer,
  getAllCustomerSer,
  // loginSer,
  // registerSer,
  updateCustomerSer,
  updateImageCustomerSer,
  // verifyEmailSer,
} from "../services/customer.service";
import { verifyRefreshToken } from "../utils/jwt.util";
import { errorResponse, successResponse } from "../utils/response.util";
import {
  RequestFile,
  RequestWithProcessedFiles,
  uploadImages,
  uploadImagesToCloudinary,
} from "../middlewares/uploadHandler";
import { CloudinaryAsset } from "../@types/cloudinary";
import { ArrangeType } from "../@types/type";
import { log } from "../utils/logger";

// export const register = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { email, password, confirmPassword } = req.body;
//     const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
//     const isCheckEmail = reg.test(email);

//     if (!email || !password || !confirmPassword) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "The input is required",
//       });
//     }

//     if (!isCheckEmail) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "Email is not in correct format",
//       });
//     }

//     if (password !== confirmPassword) {
//       return res
//         .status(200)
//         .json({ status: "ERR", message: "Password and confirm password are not the same" });
//     } else {
//       const data = await registerSer(req.body);
//       const { refresh_token, ...newData } = data;

//       res.cookie("refresh_token", refresh_token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       });
//       return res.status(200).json({
//         status: "OK",
//         newData,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(404).json({
//       message: "Controller.login err",
//       error: err,
//     });
//   }
// };

// export const login = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { email, password } = req.body;
//     const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
//     const isCheckEmail = reg.test(email);

//     if (!email || !password) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "The input is required",
//       });
//     }

//     if (!isCheckEmail) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "Email is not in correct format",
//       });
//     }

//     const response = await loginSer(req.body);
//     const { refresh_token, ...newData } = response;

//     res.cookie("refresh_token", refresh_token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//     return res.status(200).json(newData);
//   } catch (err) {
//     console.log(err);
//     return res.status(404).json({
//       message: "Controller.login err",
//       error: err,
//     });
//   }
// };

// export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { email, otp } = req.body;
//     const response = await verifyEmailSer(email, otp);
//     return res.status(200).json(response);
//   } catch (error) {
//     return res.status(404).json({
//       status: "ERR",
//       message: "ERR Controller.verifyEmail",
//     });
//   }
// };

export const refreshToken = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.headers.token?.toString().split(" ")[1];
    if (!token) {
      return res.status(200).json({
        status: "ERR",
        message: "Token is not defined",
      });
    }
    const data = await verifyRefreshToken(token);
    const { refresh_token, ...newData } = data;

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(newData);
  } catch (error) {
    console.log("err refresh token", error);
    return res.status(404).json({
      status: "ERR",
      message: "ERR Controller.refreshToken",
    });
  }
};

export const fetchCustomerControl = async (req: Request, res: Response): Promise<any> => {
  const id = Number(req.params.id);
  try {
    const data = await fetchCustomerSer(id);
    return successResponse(res, data, "fetch user success");
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: "ERR Controller.refreshToken",
    });
  }
};

export const updateCustomer = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);
    if (!id) return errorResponse(res, "id is required", 404);

    const updateData = req.body;
    const data = await updateCustomerSer(id, updateData);
    return successResponse(res, data, "update user success");
  } catch (error) {
    console.log("Controller", error);
    return res.status(404).json({
      status: "ERR",
      message: "ERR Controller.updateCustomer",
    });
  }
};

export const updateImageCustomerCTL = async (req: RequestFile, res: Response): Promise<any> => {
  try {
    const id = Number(req.body.id);
    const file = req.uploadedImage as CloudinaryAsset;
    const publicId = req.body.publicId;
    if (!id) return errorResponse(res, "id is required", 404);

    const data = await updateImageCustomerSer(id, publicId, file);
    return successResponse(res, data, "update user success");
  } catch (error) {
    console.log("Controller", error);
    return res.status(404).json({
      status: "ERR",
      message: "ERR Controller.updateCustomer",
    });
  }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<any> => {
  const id = Number(req.params.id);
  try {
    const data = await deleteCustomerSer(id);
    return successResponse(res, data, "delete user success");
  } catch (error) {
    console.log("Controller", error);
    return res.status(404).json({
      status: "ERR",
      message: "ERR Controller.deleteCustomer",
    });
  }
};

export const getAllCustomer = async (req: Request, res: Response): Promise<any> => {
  try {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset);
    const arrangeType =
      (req.query.arrangeType as string)?.toUpperCase() === "ASC" ? "ASC" : ("DESC" as ArrangeType);
    if (limit < 0 || offset < 0)
      return errorResponse(res, "limit and offset must be greater than 0", 404);
    const data = await getAllCustomerSer(limit, offset, arrangeType);
    return successResponse(res, data, "success");
  } catch (error) {
    console.log("Controller", error);
    return errorResponse(res, "Err Ctl.getAllCustomer", 404);
  }
};

export const createCustomer = async (req: RequestFile, res: Response): Promise<any> => {
  try {
    const file = req.uploadedImage as CloudinaryAsset;
    const newCustomer = JSON.parse(req.body.data);
    console.log("file", file);
    console.log("newCustomer", newCustomer);
    const data = await addCustomerSer(newCustomer, file);
    return successResponse(res, data, "success");
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};
