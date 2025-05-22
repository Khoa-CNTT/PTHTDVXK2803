import { Seat } from "./seat";

export interface FormDataTicket {
  tripId: number;
  user: User;
  seats: Seat[];
  price: number;
}

export interface User extends UserInfo {
  email: string;
  fullName: string;
  dateBirth?: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

export interface UserInfo {
  id?: number;
}
