import { create } from "zustand";

export interface SeatSleepType {
  id?: number;
  position: string;
  status: string;
  floor: "top" | "bottom";
  car_id?: number;
}

interface SeatSleepStore {
  seats: SeatSleepType[];
  setSeats: (seat: SeatSleepType[]) => void;
  updateSeat: (position: string, status: SeatSleepType["status"]) => void;
}

export const createSeatStore = (initialSeats: SeatSleepType[] = []) =>
  create<SeatSleepStore>((set) => ({
    seats: initialSeats,
    setSeats: (seats) => set({ seats }),
    updateSeat: (position, status) =>
      set((state) => ({
        seats: state.seats.map((s) => (s.position === position ? { ...s, status } : s)),
      })),
  }));
