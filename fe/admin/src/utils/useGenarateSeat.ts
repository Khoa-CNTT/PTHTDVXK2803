import { SeatType } from "../components/Seat";

export const generateNormalSeats = (): SeatType[] => {
  const seats: SeatType[] = [];
  for (let i = 1; i <= 14; i++) {
    const padded = i.toString().padStart(2, "0");
    seats.push({ position: `A${padded}`, status: "available" });
    seats.push({ position: `B${padded}`, status: "available" });
  }
  return seats;
};

export const generateSleeperSeats = (): SeatType[] => {
  const seats: SeatType[] = [];
  for (let i = 1; i <= 20; i++) {
    const padded = i.toString().padStart(2, "0");
    seats.push({ position: `A${padded}`, status: "available", floor: "bottom" });
    seats.push({ position: `B${padded}`, status: "available", floor: "top" });
  }
  return seats;
};
