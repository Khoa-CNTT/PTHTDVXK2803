import { ResultSetHeader, RowDataPacket } from "mysql2";
import { FormBookedTripType, SearchTripType, TripFormData } from "../@types/trip";
import { Seat } from "../models/seat";
import { ArrangeType } from "../@types/type";
import { TripInfo } from "../models/trip";
import dayjs from "dayjs";

type SortOrder = "ASC" | "DESC" | null;

export class TripService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  getTotal = async (): Promise<number> => {
    try {
      const [rows] = await this.db.execute("select count(*) as total from trip");
      return (rows as RowDataPacket[])[0].total;
    } catch (error) {
      throw error;
    }
  };

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
      throw error;
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
      throw error;
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
      throw error;
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
      console.log('values', valuesTrip)
      const [resultTrip] = (await conn.execute(
        "call addTrip(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        valuesTrip
      )) as [ResultSetHeader];

      const newTripId = resultTrip[0][0].tripId;

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
      return {
        status: "ERR",
        message: "Unexpected server error",
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      conn.release();
    }
  };

  public getAll = async (
    limit: number,
    offset: number,
    arrangeType: ArrangeType,
    licensePlateSearch: string
  ) => {
    try {
      const total = await this.getTotal();
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
          total: total,
          totalPage: Math.ceil(total / limit),
          data: rows[0],
        };
      } else {
        return null;
      }
    } catch (error) {}
  };

  public getAllFiltered = async (
    limit: number,
    offset: number,
    priceSort: SortOrder,
    timeSort: SortOrder,
    filters: {
      licensePlate?: string;
      departure?: string;
      arrival?: string;
      startTime?: string;
      endTime?: string;
    }
  ) => {
    try {
      let startTimeParam: string | null = null;
      if (filters.startTime) {
        const parsed = dayjs(filters.startTime, "DD/MM/YYYY HH:mm", true);
        if (parsed.isValid()) {
          startTimeParam = parsed.format("YYYY-MM-DD HH:mm:ss");
        }
      }

      let endTimeParam: string | null = null;
      if (filters.endTime) {
        const parsedEnd = dayjs(filters.endTime, "DD/MM/YYYY HH:mm", true);
        if (parsedEnd.isValid()) {
          endTimeParam = parsedEnd.format("YYYY-MM-DD HH:mm:ss");
        }
      } else if (startTimeParam) {
        // Mặc định endTime = startTime
        endTimeParam = startTimeParam;
      }

      const priceSortParam =
        priceSort && (priceSort.toUpperCase() === "ASC" || priceSort.toUpperCase() === "DESC")
          ? priceSort.toUpperCase()
          : "ASC";

      const timeSortParam =
        timeSort && (timeSort.toUpperCase() === "ASC" || timeSort.toUpperCase() === "DESC")
          ? timeSort.toUpperCase()
          : "ASC";

      const value = [
        limit,
        offset,
        priceSortParam,
        timeSortParam,
        filters.licensePlate || null,
        filters.departure || null,
        filters.arrival || null,
        startTimeParam,
        endTimeParam,
      ];

      console.log("Parameters for getAllFilteredTrip:", value);

      const [rows] = await this.db.execute(
        `CALL getFilteredTrips(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        value
      );

      return {
        data: rows[0],
      };
    } catch (error) {
      console.error("getAllFiltered error:", error);
      return null;
    }
  };

  fetch = async (id: number) => {
    try {
      const [rows] = await this.db.execute("call getTripById(?)", [id]);
      const detailTrip: TripInfo = rows[0][0];
      if (detailTrip) {
        return {
          detailTrip,
        };
      } else {
        return {
          status: "ERR",
          message: "Get detail trip not success",
        };
      }
    } catch (error) {
      throw error;
    }
  };

  search = async (searchValue: SearchTripType) => {
    try {
      console.log("search-value", searchValue);
      const { from, to, start_time, sort, limit, offset } = searchValue;
      const value = [from, to, start_time, sort, limit, offset];
      const [rows] = await this.db.execute(
        "call search_trips_by_filtered(?, ?, ?, ?, ?, ?)",
        value
      );
      const totalTrips = rows[1][0].totalCount;
      return {
        status: "OK",
        total: totalTrips,
        totalPage: Math.ceil(totalTrips / limit),
        data: rows[0],
      };
    } catch (error) {
      throw error;
    }
  };

  getDetailTripBooked = async (formValue: FormBookedTripType) => {
    const { from, to, start_day, start_hours, end_day, end_hours, license_plate } = formValue;
    const value = [from, to, start_day, start_hours, end_day, end_hours, license_plate];
    const [rows] = await this.db.execute("call getTripByConditions(?, ?, ?, ?, ?, ?, ?)", value);
    const detailTrip = rows[0][0];
    if (!detailTrip) {
      return {
        status: "ERR",
        message: "Not found trip",
      };
    } else {
      return {
        detailTrip,
      };
    }
  };
}

export default TripService;
