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
