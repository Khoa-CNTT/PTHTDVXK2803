interface Trip {
  id: number;
  car_id: number;
  driver_id: number;
  trip_name: string;
  departure_time: string; // datetime
  departure_location_id: number;
  arrival_time: string; // datetime
  arrival_location_id: number;
  price: number; // decimal(10, 2)
}
