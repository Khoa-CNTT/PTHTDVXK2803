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

  updateSeats = async (
    positions: string[],
    tripId: number,
    customerId: number,
    status: "available" | "pending" | "booked"
  ) => {
    const connection = await this.db.getConnection();
    try {
      await connection.beginTransaction();

      for (const position of positions) {
        const [rows] = (await connection.execute("CALL update_seat(?, ?, ?, ?)", [
          tripId,
          customerId,
          position,
          status,
        ])) as [ResultSetHeader];

        if (rows.affectedRows <= 0) {
          await connection.rollback();
          return {
            status: "ERR",
            message: `Update seat ${position} failed`,
          };
        }
      }

      await connection.commit();
      return {
        status: "OK",
        message: "Update all seats success",
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };
}

export default SeatService;
