import { ResultSetHeader } from "mysql2";
import { FormDataTicket } from "../models/ticket";
import { searchTicket } from "../@types/ticket";

export class TicketService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  
  add = async (newTicket: FormDataTicket) => {
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();

      const { tripId, price, seats, user } = newTicket;
      const valuesTicket = [
        tripId,
        seats.map((s) => s.position).join(","),
        user.id,
        user.email,
        user.fullName,
        user.phone || "",
        price,
      ];
      const [resultTrip] = (await conn.execute(
        "call create_ticket(?, ?, ?, ?, ?, ?, ?)",
        valuesTicket
      )) as [ResultSetHeader];

      const newTicketId = resultTrip[0][0].ticketId;

      if (!newTicketId) {
        await conn.rollback();
        return {
          status: "ERR",
          message: "Create ticket failed",
        };
      }

      await conn.commit();

      return {
        status: "OK",
        message: "Add ticket success",
        ticket: newTicketId,
      };
    } catch (error) {
      await conn.rollback();
      return {
        status: "ERR",
        message: "Unexpected server error",
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      conn.release();
    }
  };

  getDetailTicket(data: searchTicket): Promise<object> {
    return new Promise(async (resolve, reject) => {
      try {
        const {phone , idTicket} = data

        const sql = "call updatePassword( ?, ?)";
          const values = [
            phone,
            idTicket
          ];

        const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
        if (rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Ticket not found",
          });
        }
        resolve(rows[0][0]);
      } catch (error) {
        console.log("Err Service.getDetail", error);
        reject(error);
      }
    });
  }

}

export default TicketService;
