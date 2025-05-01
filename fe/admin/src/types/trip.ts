import { TypeBus } from "./bus";

export interface CoAndDriverType {
  id: number;
  fullName: string;
  phone: string;
}

export interface BusType {
  id: number;
  licensePlate: string;
  type: TypeBus;
}

export interface FormDataType {
  cars: BusType[];
  drivers: CoAndDriverType[];
  coDrivers: CoAndDriverType[];
}

export interface TripData {
  id: number;
  tripName: string;
  startTime: string; // ISO string hoặc bạn có thể dùng Date nếu parse trước
  endTime: string;
  status: "sẵn sàng" | "sắp khởi hành" | "đang chạy" | "bảo trì";
  price: number;
  createAt: string;
  updateAt: string;
  licensePlate: string | null;
  driverName: string | null;
  departureLocation: string | null;
  arrivalLocation: string | null;
  totalSeatAvailable: number;
  totalSeatBooked: number;
}
