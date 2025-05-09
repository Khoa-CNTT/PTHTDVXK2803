import { useCallback, useEffect, useState } from "react";
import styles from "../styles/seatMapNormal.module.scss";
import Seat, { SeatType } from "./Seat";
import { toast } from "react-toastify";
import seatActive from "../assets/seat_active.svg";
import seatDisabled from "../assets/seat_disabled.svg";

const SeatMapNormal = ({
  onSelected,
  initialSeats,
}: {
  onSelected?: (seats: SeatType[]) => void;
  initialSeats?: SeatType[];
}) => {
  const [seats, setSeats] = useState<SeatType[]>(initialSeats);

  const handleSelectedSeat = useCallback((updatedSeat: SeatType) => {
    if (onSelected) {
      setSeats((prevSeats) =>
        prevSeats.map((seat) => (seat.position === updatedSeat.position ? updatedSeat : seat))
      );
    } else {
      toast.warning("Bạn không có quyền thay đổi trạng thái của nó");
    }
  }, []);

  useEffect(() => {
    if (onSelected) {
      onSelected(seats);
    }
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
      <div className={styles.description}>
        <div className={styles["seat-group"]}>
          <img src={seatActive} className={styles.img} alt={`seat-active`} />
          <p className={styles.title}>Ghế được bán</p>
        </div>
        <div className={styles["seat-group"]}>
          <img src={seatDisabled} className={styles.img} alt={`seat-disabled`} />
          <p className={styles.title}>Ghế không bán</p>
        </div>
      </div>
      <div className={styles["seat-list"]}>
        {renderSeats("A")}
        {renderSeats("B")}
      </div>
    </div>
  );
};

export default SeatMapNormal;
