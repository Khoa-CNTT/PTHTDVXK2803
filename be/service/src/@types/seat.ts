export interface Seat {
  id: number;
  trip_id: number;
  customer_id: number;
  seat_number: string;
  status: "available" | "pending" | "booked";
  update_at: string; // timestamp
}
