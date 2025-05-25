import { CarInfo } from "./car";
import { UserInfo } from "./user";

export interface TripInfoBase {
  id: number;
  tripName: string;
  departure: string;
  startTime: string;
  arrival: string;
  endTime: string;
  licensePlate: string;
  driverName: string;
  image: string;
  price: string;
  status: string;
  totalSeatAvailable: number;
}

export interface LocationType {
  id: number;
  name: string;
  latitude?: string;
  longitude?: string;
}

export interface ParamsSearchTrips {
  from: LocationType;
  to: LocationType;
  start_time: string;
  sort?: string;
}

export interface ParamsSearchDetailTrip {
  from: LocationType;
  to: LocationType;
  start_day: string;
  start_hours: string;
  end_day: string;
  end_hours: string;
  license_plate: string;
}

export interface SearchTripResponse {
  status: string;
  total: number;
  totalPage: number;
  data: TripInfoBase[];
}

interface SeatInfo {
  id?: number;
  tripId?: number;
  position: string;
  price?: number;
  status: "available" | "selecting" | "unavailable";
  floor?: "top" | "bottom";
}

export interface TripBookedInfo {
  id: number;
  name: string;
  car: CarInfo;
  driver: UserInfo;
  coDrivers: UserInfo[];
  departure: LocationType;
  startTime: string;
  arrival: LocationType;
  endTime: string;
  price: number;
  seats: SeatInfo[];
}

export interface TripData {
  id: number;
  tripName: string;
  startTime: string;
  endTime: string;
  status: string;
  price: number;
  licensePlate: string | null;
  driverName: string | null;
  departureLocation: string | null;
  arrivalLocation: string | null;
  totalSeatAvailable: number;
  totalSeatBooked: number;
}
