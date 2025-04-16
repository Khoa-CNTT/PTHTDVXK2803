import { LoginType } from "../types/type";
import { bookTicketAPI } from "./customize.service";

export const login = async (data: LoginType) => {
  const response = await bookTicketAPI.post("/user/auth/login", data).then((res) => res.data);
  return response;
};
