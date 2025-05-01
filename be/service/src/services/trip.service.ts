import { ResultSetHeader } from "mysql2";
import { TripFormData } from "../@types/trip";
import { Seat } from "../models/seat";
import { ArrangeType } from "../@types/type";

export class TripService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  getAllCar = async () => {
    try {
      const [rows] = await this.db.execute(
        "select id, license_plate as licensePlate, type from car"
      );
      if (rows.length > 0) {
        return rows;
      } else {
        return null;
      }
    } catch (error) {
      console.log("err", error);
    }
  };
  getAllDriver = async () => {
    try {
      const [rows] = await this.db.execute(
        "select id, full_name as fullName, phone from user where role = 'driver'"
      );
      if (rows.length > 0) {
        return rows;
      } else {
        return null;
      }
    } catch (error) {
      console.log("err", error);
    }
  };
  getAllCoDriver = async () => {
    try {
      const [rows] = await this.db.execute(
        `select id, full_name as fullName, phone from user where role = 'co-driver'`
      );
      if (rows.length > 0) {
        return rows;
      } else {
        return null;
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  getFormData = async () => {
    try {
      const [cars, drivers, coDrivers] = await Promise.all([
        this.getAllCar(),
        this.getAllDriver(),
        this.getAllCoDriver(),
      ]);
      return { cars, drivers, coDrivers };
    } catch (error) {
      return error;
    }
  };

  add = async (newTrip: TripFormData, newSeats: Seat[]) => {
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();

      const {
        tripName,
        carId,
        driverId,
        coDrivers,
        departureId,
        arrivalId,
        price,
        startTime,
        endTime,
      } = newTrip;
      console.log("departureTime", startTime);
      console.log("arrivalTime", endTime);
      const valuesTrip = [
        carId,
        driverId,
        tripName,
        departureId,
        startTime,
        arrivalId,
        endTime,
        "sẵn sàng",
        price,
      ];
      console.log("newTrip", newTrip);
      const [resultTrip] = (await conn.execute(
        "call addTrip(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        valuesTrip
      )) as [ResultSetHeader];

      const newTripId = resultTrip[0][0].tripId;
      console.log("tripId", newTripId);

      if (resultTrip.affectedRows <= 0) {
        await conn.rollback();
        return {
          status: "ERR",
          message: "Create Trip failed",
        };
      } else {
        const tripCoDriverSQL = "call addTripCoDriver(?, ?)";
        if (coDrivers.length > 0) {
          for (const coDriver of coDrivers) {
            const [resultTCD] = (await conn.execute(tripCoDriverSQL, [newTripId, coDriver.id])) as [
              ResultSetHeader
            ];
            if (resultTCD.affectedRows <= 0) {
              await conn.rollback();
              return {
                status: "ERR",
                message: "Add Trip Co-driver failed",
              };
            }
          }
        }

        const seatSQL = "call addSeat(?, ?, ?, ?)";
        if (newSeats.length > 0) {
          for (const seat of newSeats) {
            const valuesSeat = [
              newTripId ?? null,
              seat.position ?? null,
              seat.status ?? null,
              seat.floor ?? null,
            ];
            const [resultTCD] = (await conn.execute(seatSQL, valuesSeat)) as [ResultSetHeader];
            if (resultTCD.affectedRows <= 0) {
              await conn.rollback();
              return {
                status: "ERR",
                message: "Add seat failed",
              };
            }
          }
        }
      }

      await conn.commit();

      return {
        status: "OK",
        message: "Add Trip success",
        tripId: newTripId,
      };
    } catch (error) {
      await conn.rollback();
      console.log("err", error);
      return {
        status: "ERR",
        message: "Unexpected server error",
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      conn.release();
    }
  };

  getAll = async (
    limit: number,
    offset: number,
    arrangeType: ArrangeType,
    licensePlateSearch: string
  ) => {
    try {
      const [rows] = await this.db.execute(`call getAllTrip(?, ?, ?, ?)`, [
        limit,
        offset,
        arrangeType,
        licensePlateSearch,
      ]);
      if (rows.length > 0) {
        return {
          status: "OK",
          message: "Get all trip success",
          data: rows[0],
        };
      } else {
        return null;
      }
    } catch (error) {
      console.log("err", error);
    }
  };
}

export default TripService;
