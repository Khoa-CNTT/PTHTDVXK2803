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
  license_plate: string;
  type: string;
  driver_name: string;
  driver_phone: string;
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