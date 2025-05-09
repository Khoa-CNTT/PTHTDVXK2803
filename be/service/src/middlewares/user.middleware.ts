import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.util";

interface UserRequest extends Request {
  user?: { id: number; role: string };
}

// export const validateToken = (req: UserRequest, res: Response, next: NextFunction) => {
//   const authHeader = req.headers["authorization"];

//   if (!authHeader || !authHeader.startsWith("Bearer")) {
//     errorResponse(res, "Token không hợp lệ hoặc không tồn tại", 401);
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decode = jwt.verify(token, process.env.ACCESS_TOKEN) as { id: number; role: string };
//     req.user = decode;
//     next();
//   } catch (error) {
//     errorResponse(res, "Token không hợp lệ hoặc đã hết hạn", 401);
//   }
// };
