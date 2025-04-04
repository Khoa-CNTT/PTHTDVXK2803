interface Ticket {
  id: number;
  trip_id: number;
  customer_id: number;
  seat_id: number;
  payment_status: "pending" | "paid" | "canceled";
  payment_method: "paypal" | "vnpay" | "momo";
  totalPrice: number; // decimal(10, 2)
  create_at: string; // timestamp
}
