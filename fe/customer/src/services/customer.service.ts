import { toast } from "react-toastify";
import { bookTicketAPI } from "./customizeAxios.service";

export type RegisterType = {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
};

export const register = async (data: RegisterType) => {
  try {
    const response = await bookTicketAPI.post("/customer/register", data);
    return response.data;
  } catch (err) {
    toast.warning(err instanceof Error ? err.message : "Lỗi khi đăng ký");
    return null;
  }
};

export const updatePasswordCustomer = async (data: object) => {
  try {
    const response = await bookTicketAPI.post("/customer/update-password", data);
    return response;
  } catch (err) {
    toast.warning(err instanceof Error ? err.message : "Lỗi khi cập nhật mật khẩu");
    return null;
  }
};

export const insetOtpForgotPassword = async (email: string) => {
  try {
    const response = await bookTicketAPI.post("/customer/insert-otp-forgot-password", { email });
    return response.data;
  } catch (err) {
    toast.warning(err instanceof Error ? err.message : "Lỗi khi gửi mã OTP quên mật khẩu");
    return null;
  }
};

export const sendOtp = async (email: string) => {
  try {
    const response = await bookTicketAPI.post("/customer/send-otp", { email });
    return response.data;
  } catch (err) {
    toast.warning(err instanceof Error ? err.message : "Lỗi khi gửi mã OTP xác thực");
    return null;
  }
};

export const verifyOtpForgotPassword = async (data: object) => {
  try {
    const response = await bookTicketAPI.post("/customer/verify-email-forgot-password", data);
    return response.data;
  } catch (err) {
    toast.warning(err instanceof Error ? err.message : "Lỗi khi xác thực OTP");
    return null;
  }
};

export const updateNewPassword = async (data: object) => {
  try {
    const response = await bookTicketAPI.post("/customer/update-new-password", data);
    return response.data;
  } catch (err) {
    toast.warning(err instanceof Error ? err.message : "Lỗi khi cập nhật mật khẩu mới");
    return null;
  }
};
