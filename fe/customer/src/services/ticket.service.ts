import { FormDataTicket } from "../pages/BookedPage";
import { bookTicketAPI } from "./customizeAxios.service";

export const createTicket = async (formData: FormDataTicket) => {
  const response = await bookTicketAPI.post("/ticket/add", formData).then((res) => res.data);
  return response;
};

export const getDetailTicket = async (data: object) => {
  const response = await bookTicketAPI.post("/ticket/get-detail-ticket", data).then((res) => res.data);
  return response;
};

export const getDetailTicketByEmail = async (email: string) => {
  const response = await bookTicketAPI.post("/ticket/get-detail-ticket-by-email", email).then((res) => res.data);
  return response;
};
