import express, { Request, Response } from "express";
import payOSRouter from "./payos.routes";
import webhookRouter from "./webhook.routes";
import { errorHandler } from "../middlewares/error";

const routes = (app: express.Application): void => {
  app.use("/api/payos", payOSRouter);
  app.use("/api/webhook", webhookRouter);
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
