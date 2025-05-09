export interface Seat {
  id?: number;
  tripId?: number;
  position: string;
  price?: number;
  status: "available" | "booked" | "unavailable";
  floor?: "top" | "bottom";
}
