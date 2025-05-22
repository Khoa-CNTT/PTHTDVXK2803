import { useEffect, useState } from "react";
import styles from "../styles/seatMapNormal.module.scss";
import Seat, { SeatType } from "./Seat";
import { toast } from "react-toastify";

const SeatMapNormal = ({
  onSelected,
  initialSeats,
}: {
  onSelected?: (seats: SeatType[]) => void;
  initialSeats?: SeatType[];
}) => {
  const [seats, setSeats] = useState<SeatType[]>(initialSeats || []);

  useEffect(() => {
    if (onSelected) {
      const selectedSeats = seats.filter((seat) => seat.status === "selecting");
      onSelected(selectedSeats);
    }
  }, [seats]);

  const handleSelectedSeat = (updatedSeat: SeatType) => {
    setSeats((prevSeats) => {
      const newSeats = prevSeats.map((seat) =>
        seat.position === updatedSeat.position ? updatedSeat : seat
      );
      if (onSelected) {
        const selectedSeats = newSeats.filter((seat) => seat.status === "selecting");
        if (selectedSeats.length > 5) {
          toast.warning("Bạn chỉ có thể chọn tối đa 5 ghế");
          return prevSeats;
        }
        onSelected(selectedSeats);
      }
      return newSeats;
    });
  };

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
                <Seat key={seat.position} seatValue={seat} onSelected={handleSelectedSeat} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles["normal-bus"]}>
      <div className={styles["seat-list"]}>
        {renderSeats("A")}
        {renderSeats("B")}
      </div>
    </div>
  );
};

export default SeatMapNormal;
