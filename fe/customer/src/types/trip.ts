export interface TripInfoBase {
  id: number;
  tripName: string;
  departure: string;
  startTime: string;
  arrival: string;
  endTime: string;
  licensePlate: string;
  driverName: string;
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
