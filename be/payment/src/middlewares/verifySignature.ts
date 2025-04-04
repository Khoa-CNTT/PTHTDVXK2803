import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { log } from "../utils/logger";

const CHECKSUM_KEY = process.env.CHECKSUM_KEY || "";

export const verifySignature = (req: Request, res: Response, next: NextFunction): void => {
  const signature = req.headers["x-signature"] as string;
  const payload = JSON.stringify(req.body);


  const hmac = crypto.createHmac("sha256", CHECKSUM_KEY);
  hmac.update(payload);
  const digest = hmac.digest("hex");


  if (digest !== signature) {
    res.status(401).send("Unauthorized");
    return;
  }

  next();
};
