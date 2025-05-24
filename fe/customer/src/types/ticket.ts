export interface LookupTicketPayLoad {
  email: string;
  user_name: string;
  seats: string;
  trip_name: string;
  price: string;
  start_time: string;
  end_time: string;
  payment_status: string;
}

export interface TicketPayLoad {
  ticket_id: number;
  email: string;
  user_name: string;
  seats: string;
  trip_name: string;
  price: string;
  start_time: string;
  end_time: string;
  payment_status: string;
  user_phone: number;
}