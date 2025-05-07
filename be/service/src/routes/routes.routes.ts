import express, { NextFunction, Request, Response } from "express";
import { errorHandler } from "../middlewares/error.middleware";
import busRouter from "./car.routes";
import customerRouter from "./customer.routes";
import locationRouter from "./location.routes";
import userRouter from "./user.routes";
import driverRoute from "./driver.routes";
import coDriverRoute from "./coDriver.route";
import adminRoute from "./admin.routes";
import tripRoute from "./trip.routes";
import promotionRoute from "./promotion.route";

const routes = (app: express.Application): void => {
  // Cấu hình routes
  app.use("/api/user", userRouter);
  app.use("/api/location", locationRouter);
  app.use("/api/customer", customerRouter);
  app.use("/api/bus", busRouter);
  app.use("/api/driver", driverRoute);
  app.use("/api/co-driver", coDriverRoute);
  app.use("/api/admin", adminRoute);
  app.use("/api/trip", tripRoute);
  app.use("/api/promotion", promotionRoute);

  // Route cho các yêu cầu không tìm thấy
  app.use((req: Request, res: Response): void => {
    res.status(404).json({
      status: "ERROR",
      message: "404 NOT FOUND!",
    });
  });

  // Route xử lý lỗi
  app.use(errorHandler);
};

export default routes;
