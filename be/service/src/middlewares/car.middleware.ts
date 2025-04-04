import { body, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateCreateCar: ValidationChain[] = [
  body("licensePlate")
    .trim()
    .notEmpty()
    .withMessage("Biển số xe không được để trống")
    .isLength({ min: 7, max: 10 })
    .withMessage("Biển số xe phải có độ dài từ 7 đến 10 ký tự"),
  body("type")
    .trim()
    .notEmpty()
    .withMessage("Loại xe không được để trống")
    .isIn(["Xe thường", "Xe giường nằm"])
    .withMessage("Loại xe không hợp lệ"),
  // body("status")
  //   .trim()
  //   .notEmpty()
  //   .withMessage("Trạng thái xe không được để trống")
  //   .isIn(["Sẵn sàng", "Đang chạy", "Bảo trì"])
  //   .withMessage("Trạng thái xe không hợp lệ"),
];

// Middleware xử lý lỗi validation
export const validateCreateCarMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req.body.data);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const validateUpdateCar: ValidationChain[] = [
  body("licensePlate")
    .trim()
    .notEmpty()
    .withMessage("Biển số xe không được để trống")
    .isLength({ min: 7, max: 10 })
    .withMessage("Biển số xe phải có độ dài từ 7 đến 10 ký tự"),
  body("type")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Loại xe không được để trống")
    .isIn(["Xe thường", "Xe giường nằm"])
    .withMessage("Loại xe không hợp lệ"),
  // body("status")
  //   .optional()
  //   .trim()
  //   .notEmpty()
  //   .withMessage("Trạng thái xe không được để trống")
  //   .isIn(["Sẵn sàng", "Đang chạy", "Bảo trì"])
  //   .withMessage("Trạng thái xe không hợp lệ"),
];

// Middleware xử lý lỗi
export const validateUpdateCarMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req.body.data);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
