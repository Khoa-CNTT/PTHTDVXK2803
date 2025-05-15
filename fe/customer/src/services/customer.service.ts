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
