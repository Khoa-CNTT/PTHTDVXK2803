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
      console.log("err", error);
    }
  };
}

export default SeatService;
