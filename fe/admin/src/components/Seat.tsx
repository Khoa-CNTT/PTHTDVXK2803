import seatActive from "../assets/seat_active.svg";
import seatDisabled from "../assets/seat_disabled.svg";
import seatBooked from "../assets/seat_booked.svg";
import styles from "../styles/seat.module.scss";
import React from "react";

export type SeatType = {
  id?: number;
  position: string;
  status: "available" | "booked" | "unavailable";
  tripId?: number;
  floor?: "top" | "bottom";
};
interface SeatProps {
  seatValue: SeatType;
  useStatus: "booked" | "unavailable";
  onSelected: (item: SeatType) => void;
}

const Seat: React.FC<SeatProps> = React.memo(({ seatValue, useStatus, onSelected }) => {
  const { position, status } = seatValue;

  const handleToggleStatus = () => {
    let newStatus;
    if (status === "available") {
      newStatus = useStatus;
    } else if (["booked", "unavailable"].includes(useStatus)) {
      console.log(1);
      newStatus = "available";
    }
    const updateSeat: SeatType = { ...seatValue, status: newStatus as "available" || "unavailable" || "booked" };
    onSelected(updateSeat);
  };

  return (
    <div className={styles.seat} onClick={handleToggleStatus}>
      <span className={styles.content}>{position}</span>
      <img
        src={`${
          status === "available" ? seatActive : status === "booked" ? seatBooked : seatDisabled
        }`}
        className={styles.img}
        alt={`img${status}`}
      />
    </div>
  );
});

export default Seat;
