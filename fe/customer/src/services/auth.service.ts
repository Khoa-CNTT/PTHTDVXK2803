import { LoginPayLoad, RegisterPayLoad } from "../types";
import { bookTicketAPI } from "./customizeAxios.service";

export const login = async (data: LoginPayLoad) => {
  const response = await bookTicketAPI
    .post("/user/auth/customer/login", data)
    .then((res) => res.data);
  return response;
};

export const register = async (data: RegisterPayLoad) => {
  const response = await bookTicketAPI.post("/customer/register", data).then((res) => res.data);
  return response;
};

export const veriFyEmail = async (data: object) => {
  const response = await bookTicketAPI.post("/customer/verify-email", data).then((res) => res.data);
  return response;
};

export const logoutUser = async () => {
  const response = await bookTicketAPI.post("/user/auth/logout").then((res) => res.data);
  return response;
};
