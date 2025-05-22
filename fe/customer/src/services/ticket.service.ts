import { FormDataTicket } from "../pages/BookedPage";
import { bookTicketAPI } from "./customizeAxios.service";

export const createTicket = async (formData: FormDataTicket) => {
  const response = await bookTicketAPI.post("/ticket/add", formData).then((res) => res.data);
  return response;
};
