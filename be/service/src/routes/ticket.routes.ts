import ticketController from "../controllers/ticket.controller";
import { verifyAccessToken } from "../services/auth.service";
import express from "express";

const router = express.Router();

router.post("/add", ticketController.add);

export default router;
