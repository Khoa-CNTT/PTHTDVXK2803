export interface TripFormData {
  id: number;
  carId: number;
  driverId: number;
  coDrivers?: { id: number }[];
  tripName: string;
  departureId: number;
  startTime: string; // datetime
  arrivalId: number;
  endTime: string; // datetime
  price: number; // decimal(10, 2)
}

interface SearchLocationType {
  from: number;
  to: number;
}

export interface SearchTripType extends SearchLocationType {
  start_time: string;
  sort?: "default" | "time-asc" | "time-desc" | "price-asc" | "price-desc" | "rating-desc";
  limit: number;
  offset: number;
}

export interface FormBookedTripType extends SearchLocationType {
  start_day: string;
  start_hours: string;
  end_day: string;
  end_hours: string;
  license_plate: string;
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
