import { create } from "zustand";

export interface SeatNormalType {
  id?: number;
  position: string;
  status: string;
  car_id?: number;
}

interface SeatNormalStore {
  seats: SeatNormalType[];
  setSeats: (seat: SeatNormalType[]) => void;
  updateSeat: (position: string, status: SeatNormalType["status"]) => void;
}

export const createSeatStore = (initialSeats: SeatNormalType[] = []) =>
  create<SeatNormalStore>((set) => ({
    seats: initialSeats,
    setSeats: (seats) => set({ seats }),
    updateSeat: (position, status) =>
      set((state) => ({
        seats: state.seats.map((s) => (s.position === position ? { ...s, status } : s)),
      })),
  }));
