import { toast } from "react-toastify";
import { LoginPayLoad, RegisterPayLoad } from "../types";
import { bookTicketAPI } from "./customizeAxios.service";

export const loginUser = async (data: LoginPayLoad) => {
  const response = await bookTicketAPI
    .post("/user/auth/customer/login", data)
    .then((res) => res.data).catch(err => toast.error(err?.response?.message))
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

export const logout = async () => {
  const response = await bookTicketAPI.post("/user/auth/logout").then((res) => res.data);
  return response;
};

export const getUserByEmail = async (email: string) => {
  const response = await bookTicketAPI.post("/customer/get-detail-user-email", email).then((res) => res.data);
  return response;
};

export const updateDetailUser = async (data: FormData) => {
  const response = await bookTicketAPI.post("/customer/update-detail-user", data).then((res) => res.data);
  return response;
};
