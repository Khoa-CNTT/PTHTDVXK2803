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
