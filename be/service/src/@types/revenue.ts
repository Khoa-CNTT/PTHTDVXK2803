type Revenue = {
  total_tickets: number;
  total_revenue: number;
  average_price: number;
};

export type HourlyRevenue = Revenue & {
  date_part: string;
  hour_part: number;
};

export type MonthRevenue = Revenue & {
  date_part: string;
};

export type YearRevenue = Revenue & {
  month_part: number;
};
