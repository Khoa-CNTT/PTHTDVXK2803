export class TripService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  async getAllCar() {
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
  }
  async getAllDriver() {
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
  }
  async getAllCoDriver() {
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
  }
  async getAllLocation() {
    try {
      const [rows] = await this.db.execute("select id, name from location");
      if (rows.length > 0) {
        return rows;
      } else {
        return null;
      }
    } catch (error) {
      console.log("err", error);
    }
  }

  async getFormData() {
    try {
      const [cars, drivers, coDrivers, locations] = await Promise.all([
        this.getAllCar(),
        this.getAllDriver(),
        this.getAllCoDriver(),
        this.getAllLocation(),
      ]);
      return { cars, drivers, coDrivers, locations };
    } catch (error) {
      return error;
    }
  }
}
