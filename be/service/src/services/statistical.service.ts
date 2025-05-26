import { DashboardStats } from "../@types/statistical";

class StatisticalService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  getDashboardSummary = async () => {
    try {
      const [rows] = await this.db.execute("CALL dashboard_summary()");

      const result: DashboardStats = rows[0][0];

      if (!result) {
        return {
          status: "ERR",
          message: "Err logic produce",
        };
      }

      return {
        status: "OK",
        data: {
          totalCustomers: result.totalCustomers,
          totalDrivers: result.totalDrivers,
          totalCoDrivers: result.totalCoDrivers,
          totalStaffs: result.totalStaffs,
          totalTrips: result.totalTrips,
          totalTickets: result.totalTickets,
          totalCars: result.totalCars,
          totalPromotions: result.totalPromotions,
          revenueToday: result.revenueToday,
        },
      };
    } catch (error) {
      throw error;
    }
  };
}

export default StatisticalService;
