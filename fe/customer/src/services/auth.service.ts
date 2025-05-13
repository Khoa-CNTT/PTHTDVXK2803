import { bookTicketAPI } from "./customizeAxios.service";

export type LoginType = {
  email: string;
  password: string;
};

export const login = async (data: LoginType) => {
  const response = await bookTicketAPI.post("/user/auth/admin/login", data).then((res) => res.data);
  return response;
};

export const logout = async () => {
  const response = await bookTicketAPI.post("/user/auth/logout").then((res) => res.data);
  return response;
};
