import { RevenueChartItem, RevenueSummary, TransactionItem } from "../types/revenue";
import { bookTicketAPI } from "./customize.service";

export const getRevenue = async (period: string) => {
  return await bookTicketAPI
    .get<{
      summary: RevenueSummary;
      chartData: RevenueChartItem[];
    }>(`/revenue?period=${period}`)
    .then((res) => res.data);
};

export const getTransactions = async () => {
  return await bookTicketAPI
    .get<TransactionItem[]>(`/revenue/recent-transactions/`)
    .then((res) => res.data);
};
