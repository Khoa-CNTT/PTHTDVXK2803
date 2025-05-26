// import { useQuery } from "@tanstack/react-query";
// import { getRevenue, getTransactions } from "../services/revenue.service";

// export const useRevenueData = (period: string) =>
//   useQuery({
//     queryKey: ["revenue", period],
//     queryFn: async () => {
//       const res = await getRevenue(period);
//       return res;
//     },
//   });

// export const useRecentTransactions = () =>
//   useQuery({
//     queryKey: ["transactions"],
//     queryFn: async () => {
//       const res = await getTransactions();
//       return res;
//     },
//   });
