import { DashboardStats } from "../types/statistical";
import { bookTicketAPI } from "./customize.service";

export const getDashboardStats = async () => {
  return await bookTicketAPI.get<DashboardStats>(`/statistical/get-stats`).then((res) => res.data);
};
