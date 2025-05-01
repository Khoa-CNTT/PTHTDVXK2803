import { useCallback, useEffect, useState } from "react";
import styles from "../styles/seatMapNormal.module.scss";
import Seat, { SeatType } from "./Seat";

const SeatMapNormal = ({
  onSelected,
  initialSeats,
}: {
  onSelected: (seats: SeatType[]) => void;
  initialSeats?: SeatType[];
}) => {
  const [seats, setSeats] = useState<SeatType[]>(initialSeats);

  const handleSelectedSeat = useCallback((updatedSeat: SeatType) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) => (seat.position === updatedSeat.position ? updatedSeat : seat))
    );
  }, []);

  useEffect(() => {
    onSelected(seats);
  }, [seats, onSelected]);

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

    return (
      <div className={styles.floor}>
        <div className={styles["floor-rows"]}>
          {rows.map((row, rowIndex) => (
            <div className={styles["seat-row"]} key={rowIndex}>
              {row.map((seat) => (
                <Seat
                  key={seat.position}
                  seatValue={seat}
                  useStatus="unavailable"
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
