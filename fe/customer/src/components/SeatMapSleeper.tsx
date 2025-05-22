import { useEffect, useState } from "react";
import styles from "../styles/seatMapSleeper.module.scss";
import Seat, { SeatType } from "./Seat";
import { toast } from "react-toastify";

const SeatMapSleeper = ({
  initialSeats,
  onSelected,
}: {
  initialSeats: SeatType[];
  onSelected?: (seats: SeatType[]) => void;
}) => {
  const [seats, setSeats] = useState<SeatType[]>(initialSeats);

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
      const selectedSeats = newSeats.filter((seat) => seat.status === "selecting");
      console.log("selected", selectedSeats);
      if (selectedSeats.length > 5) {
        toast.warning("Bạn chỉ có thể chọn tối đa 5 ghế");
        return prevSeats;
      }
      return newSeats;
    });
  };

  const renderFloor = (floor: "top" | "bottom") => {
    const floorSeats = seats.filter((seat) => seat.floor === floor);
    // Chia thành từng hàng (hàng 0 có 2 ghế, các hàng khác có 3)
    const rows: SeatType[][] = [];

    let i = 0;
    rows.push([floorSeats[i++], floorSeats[i++]]); // Row đầu: 2 ghế

    while (i < floorSeats.length) {
      const row: SeatType[] = [];
      if (i < floorSeats.length) row.push(floorSeats[i++]); // trái
      if (i < floorSeats.length) row.push(floorSeats[i++]); // giữa
      if (i < floorSeats.length) row.push(floorSeats[i++]); // phải
      rows.push(row);
    }

    return (
      <div className={styles.floor}>
        <h3 className={styles.title}>{floor === "bottom" ? "Tầng dưới" : "Tầng trên"}</h3>
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
    <div className={styles["sleeper-bus"]}>
      {renderFloor("bottom")}
      {renderFloor("top")}
    </div>
  );
};

export default SeatMapSleeper;
