import { useState } from "react";
import styles from "../styles/seatMapSleeper.module.scss";
import Seat, { SeatType } from "./Seat";

const generateSleeperSeats = (): SeatType[] => {
  const seats: SeatType[] = [];
  for (let i = 1; i <= 20; i++) {
    const padded = i.toString().padStart(2, "0");
    seats.push({ position: `A${padded}`, status: "available", floor: "bottom" });
    seats.push({ position: `B${padded}`, status: "available", floor: "top" });
  }
  return seats;
};

const SeatMapSleeper = () => {
  const [seats, setSeats] = useState<SeatType[]>(generateSleeperSeats());

  const handleSelectedSeat = (updatedSeat: SeatType) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) => (seat.position === updatedSeat.position ? updatedSeat : seat))
    );
  };
  console.log("seats", seats);

  const renderFloor = (floor: "top" | "bottom") => {
    const floorSeats = seats.filter((seat) => seat.floor === floor);
    console.log("floor", floorSeats);
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
    console.log("rows", rows);

    return (
      <div className={styles.floor}>
        <h3 className={styles.title}>{floor === "bottom" ? "Tầng dưới" : "Tầng trên"}</h3>
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
    <div className={styles["sleeper-bus"]}>
      {renderFloor("bottom")}
      {renderFloor("top")}
    </div>
  );
};

export default SeatMapSleeper;
