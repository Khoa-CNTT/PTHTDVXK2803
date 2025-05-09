import { ResultSetHeader } from "mysql2";
import GeocodingService from "./geocoding.service";

const geocodingService = new GeocodingService();
export class LocationService {
  private db;
  constructor(db: any) {
    this.db = db;
  }
  add = async (newLocation: string): Promise<{ status: string; message: string }> => {
    try {
      if (!newLocation) throw { message: "Name location null!" };
      const { latitude, longitude } = await geocodingService.getCoordinates(newLocation);
      await this.db.execute("call AddLocation(?, ?, ?)", [newLocation, latitude, longitude]);
      return {
        status: "OK",
        message: "Add new location success.",
      };
    } catch (error) {
      throw error;
    }
  };

  delete = async (deleteId: number): Promise<{ status: string; message: string }> => {
    try {
      const [rows] = (await this.db.execute("call deleteLocation(?)", [deleteId])) as [
        ResultSetHeader
      ];

      if (rows.affectedRows > 0) {
        return {
          status: "OK",
          message: "Delete location success.",
        };
      }
      return {
        status: "ERR",
        message: "Delete location is not success.",
      };
    } catch (error) {
      throw error;
    }
  };

  getAll = async () => {
    try {
      const [rows] = await this.db.execute("select id, name from location");
      if (rows.length > 0) {
        return {
          status: "OK",
          data: rows,
        };
      } else {
        return {
          status: "ERR",
          message: "Location not found.",
        };
      }
    } catch (error) {
      console.log("err", error);
    }
  };
}
