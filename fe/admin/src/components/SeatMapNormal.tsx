import { useState } from "react";
import styles from "../styles/seatMapNormal.module.scss";
import Seat, { SeatType } from "./Seat";

// interface SeatMapNormalProps{
//   on
// }

const generateSleeperSeats = (): SeatType[] => {
  const seats: SeatType[] = [];
  for (let i = 1; i <= 14; i++) {
    const padded = i.toString().padStart(2, "0");
    seats.push({ position: `A${padded}`, status: "available" });
    seats.push({ position: `B${padded}`, status: "available" });
  }
  return seats;
};

const SeatMapNormal = () => {
  const [seats, setSeats] = useState<SeatType[]>(generateSleeperSeats());

  const handleSelectedSeat = (updatedSeat: SeatType) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) => (seat.position === updatedSeat.position ? updatedSeat : seat))
    );
  };
  console.log("seats", seats);

  const renderSeats = (position: "A" | "B") => {
    const seatOfLetter = seats.filter((seat) => seat.position.startsWith(position));
    const rows: SeatType[][] = [];

    let i = 0;

    while (i < seatOfLetter.length) {
      const row: SeatType[] = [];
      if (i < seatOfLetter.length) row.push(seatOfLetter[i++]); // trái
      if (i < seatOfLetter.length) row.push(seatOfLetter[i++]); // phải
      rows.push(row);
    }
    console.log("rows", rows);

    return (
      <div className={styles.floor}>
        <div className={styles["floor-rows"]}>
          {rows.map((row, rowIndex) => (
            <div className={styles["seat-row"]} key={rowIndex}>
              {row.map((seat) => (
                <Seat
                  key={seat.position}
                  seatValue={seat}
                  useStatus="booked"
                  onSelected={handleSelectedSeat}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles["normal-bus"]}>
      {renderSeats("A")}
      {renderSeats("B")}
    </div>
  );
};

export default SeatMapNormal;
