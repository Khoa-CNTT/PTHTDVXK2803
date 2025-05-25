import { toast } from "react-toastify";
import { LoginPayLoad, RegisterPayLoad } from "../types";
import { bookTicketAPI } from "./customizeAxios.service";

export const loginUser = async (data: LoginPayLoad) => {
  try {
    const response = await bookTicketAPI.post("/user/auth/customer/login", data);
    return response.data;
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Đăng nhập thất bại");
    return null;
  }
};

export const register = async (data: RegisterPayLoad) => {
  try {
    const response = await bookTicketAPI.post("/customer/register", data);
    return response.data;
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Đăng ký thất bại");
    return null;
  }
};

export const veriFyEmail = async (data: object) => {
  try {
    const response = await bookTicketAPI.post("/customer/verify-email", data);
    return response.data;
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Xác thực email thất bại");
    return null;
  }
};

export const logout = async () => {
  try {
    const response = await bookTicketAPI.post("/user/auth/logout");
    return response.data;
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Đăng xuất thất bại");
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const response = await bookTicketAPI.post("/customer/get-detail-user-email", email);
    return response.data;
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Lấy thông tin người dùng thất bại");
    return null;
  }
};

export const updateDetailUser = async (data: FormData) => {
  try {
    const response = await bookTicketAPI.post("/customer/update-detail-user", data);
    return response.data;
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Cập nhật thông tin thất bại");
    return null;
  }
};

export const updateUserNoImage = async (data: object) => {
  try {
    const response = await bookTicketAPI.post("/customer/update-no-image", data);
    return response.data;
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Cập nhật thông tin thất bại");
    return null;
  }
};
