import { Seat } from "./seat";

interface Trip {
  tripName: string;
  carId: number;
  driverId: number;
  coDrivers: { id: number }[];
  departureId: number;
  arrivalId: number;
  startTime: string;
  endTime: string;
}

export interface UserInfo {
  id: number;
  fullName: string;
  phone: string;
}

export interface LocationInfo {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface CarInfo {
  id: number;
  type: "xe thường" | "xe giường nằm";
  licensePlate: string;
}

export interface TripInfo {
  id?: number;
  name: string;
  car: CarInfo;
  driver: UserInfo;
  coDrivers: UserInfo[];
  seats: Seat[];
  departure: LocationInfo;
  startTime: string;
  arrival: LocationInfo;
  endTime: string;
  price: number;
  createAt: string;
  updateAt: string;
}

export interface TripInfoBase {
  id: number;
  tripName: string;
  departureLocation: string;
  startTime: string;
  arrivalLocation: string;
  endTime: string;
  licensePlate: string;
  driverName: string;
  price: string;
  status: string;
  totalSeatAvailable: number;
}
