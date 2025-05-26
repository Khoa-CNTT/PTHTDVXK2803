import { HourlyRevenue, MonthRevenue, YearRevenue } from "../types/revenue";
import { bookTicketAPI } from "./customize.service";

export const getRevenueHour = async (period: string) => {
  return await bookTicketAPI
    .get<HourlyRevenue[]>(`/revenue/get-hour?period=${period}`)
    .then((res) => res.data);
};

export const getRevenueMonth = async (period: string) => {
  return await bookTicketAPI
    .get<MonthRevenue[]>(`/revenue/get-month?period=${period}`)
    .then((res) => res.data);
};

export const getRevenueYear = async (period: string) => {
  return await bookTicketAPI
    .get<YearRevenue[]>(`/revenue/get-year?period=${period}`)
    .then((res) => res.data);
};
