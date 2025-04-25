import { Response } from "express";

export const successResponse = (res: Response, statusCode: number = 200, data: any) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message: string = "Error",
  statusCode: number = 500
) => {
  return res.status(statusCode).json({ success: false, message });
};
