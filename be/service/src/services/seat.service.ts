import { ResultSetHeader } from "mysql2";
import { Seat } from "../models/seat";

class SeatService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  add = async (tripId: string, newSeat: Seat, price: number) => {
    try {
      const { position, status, floor } = newSeat;
      const [rows] = this.db.execute("call addSeat(?, ?, ?, ?, ?)", [
        tripId,
        position,
        price,
        status,
        floor,
      ]) as [ResultSetHeader];

      if (rows.affectedRows > 0) {
        return {
          status: "OK",
          message: "Add seat success",
        };
      } else {
        return {
          status: "ERR",
          message: "Add seat failed",
        };
      }
    } catch (error) {
      throw error;
    }
  };

  update = async (
    positions: string,
    tripId: number,
    customerId: number,
    status: "available" | "pending" | "booked"
  ) => {
    try {
      console.log("positions", positions);
      const getPosition = positions.split(",");
      console.log("get-position", getPosition);

      for (let position of getPosition) {
        const [rows] = this.db.execute("call update_seat(?, ?, ?, ?)", [
          tripId,
          customerId,
          position,
          status,
        ]) as [ResultSetHeader];

        if (rows.affectedRows > 0) {
          return {
            status: "OK",
            message: "Update seat success",
          };
        } else {
          return {
            status: "ERR",
            message: "Update seat failed",
          };
        }
      }
    } catch (error) {
      throw error;
    }
  };
}

export default SeatService;
