export interface RevenueSummary {
  total_revenue: number;
  total_orders: number;
}

export interface RevenueChartItem {
  date: string;
  revenue: number;
  orders: number;
}

export interface TransactionItem {
  full_name: string;
  seats: string;
  transaction_id: string;
  price: number;
  create_at: string;
}
