import ticketController from "../controllers/ticket.controller";
import { verifyAccessToken } from "../services/auth.service";
import express from "express";

const router = express.Router();

router.post("/add", ticketController.add);
router.post("/get-detail-ticket/", ticketController.getDetailTicket);
router.post("/get-detail-ticket-by-email/", ticketController.getDetailTicketByEmail);

export default router;
