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

export interface searchTicket {
  phone: string;
  idTicket: string;
}

export interface TicketType {
  id: number;
  customerId: number;
  tripId: number;
  email: string;
  fullName: string;
  phone: string;
  tripName: string;
  startTime: string;
  departure: string;
  arrival: string;
  seatPosition: string;
  paymentStatus: string;
  paymentMethod: string;
  price: number;
}
