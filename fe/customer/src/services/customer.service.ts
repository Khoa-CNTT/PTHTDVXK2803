import { bookTicketAPI } from "./customizeAxios.service";

export type RegisterType = {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
};

export const register = async (data: RegisterType) => {
  const response = await bookTicketAPI.post("/customer/register", data).then((res) => res.data);
  return response;
};

export const updatePasswordCustomer = async (data: object) => {
  return await bookTicketAPI.post("/customer/update-password", data).then((res) => res.data);
};

export const insetOtpForgotPassword = async (email: string) => {
  return await bookTicketAPI.post("/customer/insert-otp-forgot-password", {email: email}).then((res) => res.data);
};

export const sendOtp = async (email: string) => {
  return await bookTicketAPI.post("/customer/send-otp", {email: email}).then((res) => res.data);
};

export const verifyOtpForgotPassword = async (data: object) => {
  return await bookTicketAPI.post("/customer/verify-email-forgot-password", data).then((res) => res.data);
};

export const updateNewPassword = async (data: object) => {
  return await bookTicketAPI.post("/customer/update-new-password", data).then((res) => res.data);
};