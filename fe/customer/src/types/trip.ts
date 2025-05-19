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

export interface ParamsSearchTrip {
  from: LocationType;
  to: LocationType;
  start_time: string;
  sort?: string;
}

export interface SearchTripResponse {
  status: string;
  total: number;
  totalPage: number;
  data: TripInfoBase[];
}
