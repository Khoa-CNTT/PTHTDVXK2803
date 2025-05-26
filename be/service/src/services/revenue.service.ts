import { HourlyRevenue, MonthRevenue, YearRevenue } from "../@types/revenue";
import getDaysInMonthUtil from "../utils/getDaysInMonthUtil";

class RevenueService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  getHourlyRevenue = async (dateRange) => {
    try {
      const today = new Date();
      let startDate = new Date(today);
      let endDate = new Date(today);

      if (dateRange === "yesterday") {
        startDate.setDate(today.getDate() - 1);
        console.log("start-day", startDate.getDate());
        endDate = new Date(startDate);
      }

      const values = [startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0]];

      console.log("values", values);

      const [rows] = await this.db.execute("CALL GetHourlyRevenue(?, ?)", values);
      const rawData = rows[0];

      if (!rawData) {
        return {
          status: "ERR",
          message: "Err logic Produce",
        };
      }

      const fullData = Array.from({ length: 24 }, (_, hour) => {
        const found = rawData.find((item: HourlyRevenue) => item.hour_part === hour);
        return {
          hour_part: hour,
          total_revenue: found ? parseFloat(found.total_revenue) : 0,
          total_tickets: found ? found.total_tickets : 0,
          average_price: found ? parseFloat(found.average_price) : 0,
        };
      });

      return {
        status: "OK",
        data: fullData,
      };
    } catch (error) {
      throw error;
    }
  };

  getMonthRevenue = async (monthRange: number) => {
    try {
      const year = new Date().getFullYear();
      const allDates = getDaysInMonthUtil(monthRange, year);
      const [rows] = await this.db.execute("CALL GetDayRevenueByMonth(?)", [monthRange]);
      const rawData = rows[0];

      if (!rawData) {
        return {
          status: "ERR",
          message: "Err logic Produce",
        };
      }

      const fullData = allDates.map((date) => {
        const found = rawData.find((item: MonthRevenue) => {
          return new Date(item.date_part).toISOString().split("T")[0] === `${date}`;
        });
        return {
          date_part: date,
          total_revenue: found ? parseFloat(found.total_revenue) : 0,
          total_tickets: found ? found.total_tickets : 0,
          average_price: found ? parseFloat(found.average_price) : 0,
        };
      });

      return {
        status: "OK",
        data: fullData,
      };
    } catch (error) {
      throw error;
    }
  };

  getYearRevenue = async (yearRange: number) => {
    try {
      const [rows] = await this.db.execute("CALL GetMonthRevenueByYear(?)", [yearRange]);
      const rawData: YearRevenue[] = rows[0];

      if (!rawData) {
        return {
          status: "ERR",
          message: "Err logic Produce",
        };
      }

      const fullData = Array.from({ length: 12 }, (_, month) => {
        console.log("month", month);
        const found = rawData.find((item: YearRevenue) => item.month_part === month);
        return {
          month_part: month + 1,
          total_revenue: found ? parseFloat(String(found.total_revenue)) : 0,
          total_tickets: found ? found.total_tickets : 0,
          average_price: found ? parseFloat(String(found.average_price)) : 0,
        };
      });

      return {
        status: "OK",
        data: fullData,
      };
    } catch (error) {
      throw error;
    }
  };
}

export default RevenueService;
