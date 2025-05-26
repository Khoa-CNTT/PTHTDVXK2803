import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { ArrangeType } from "../@types/type";
import { convertToVietnamTime } from "../utils/convertTime";
import { formatDate } from "../utils/formatDate";

type Promotion = {
  code: string;
  carType: "all" | "xe-thuong" | "xe-giuong-nam";
  type: "percentage" | "fixed";
  discountAmount: number;
  description: string;
  startDate: string;
  endDate: string;
};

export class PromotionService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  async total(): Promise<number> {
    const query = "SELECT COUNT(*) AS totalPromotions FROM discount";
    const [rows] = await this.db.execute(query);
    return (rows as RowDataPacket[])[0].totalPromotions;
  }

  async getAll(
    limit: number,
    offset: number,
    arrangeType: ArrangeType,
    code: string,
    type: "all" | "percentage" | "fixed",
    carTypes: string
  ): Promise<{ status: string; total: number; totalPage: number; data: any[] }> {
    const totalCount = await this.total();

    const [row] = await this.db.execute("CALL getAllPromotions(?, ?, ?, ?, ?, ?)", [
      limit,
      offset,
      arrangeType,
      code,
      carTypes,
      type,
    ]);

    const promotions = row[0].map((item: any) => {
      item.startDate = formatDate(item.startDate, "DD/MM/YYYY", false);
      item.endDate = formatDate(item.endDate, "DD/MM/YYYY", false);
      item.createdAt = formatDate(item.createdAt, "DD/MM/YYYY", true);
      return item;
    });

    return {
      status: "OK",
      total: totalCount,
      totalPage: Math.ceil(totalCount / limit),
      data: totalCount > 0 ? promotions : [],
    };
  }

  async getByCode(code: string) {
    const [rows] = await this.db.execute("CALL getPromotionByCode(?)", [code]);
    if (!rows[0] || rows[0].length === 0) {
      return {
        status: "ERR",
        message: "Promotion not found",
      };
    }

    const promo = rows[0][0];
    promo.startDate = formatDate(promo.startDate, "DD/MM/YYYY", false);
    promo.endDate = formatDate(promo.endDate, "DD/MM/YYYY", false);
    promo.createdAt = formatDate(promo.createdAt, "DD/MM/YYYY", true);

    return {
      status: "OK",
      data: promo,
    };
  }

  async getById(id: number) {
    const [rows] = await this.db.execute("CALL getPromotionById(?)", [id]);
    if (!rows[0] || rows[0].length === 0) {
      return {
        status: "ERR",
        message: "Promotion not found",
      };
    }

    const promo = rows[0][0];
    promo.startDate = promo.startDate;
    promo.endDate = promo.endDate;
    promo.createdAt = promo.createdAt;

    return {
      status: "OK",
      data: promo,
    };
  }

  async add(promotion: Promotion): Promise<{ status: string; message: string }> {
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();

      const { code, carType, type, discountAmount, description, startDate, endDate } = promotion;

      const sql = "CALL addPromotion(?, ?, ?, ?, ?, ?, ?)";
      const values = [code, carType, type, discountAmount, description, startDate, endDate];
      await conn.execute(sql, values);

      await conn.commit();
      return { status: "OK", message: "Create promotion success" };
    } catch (error: any) {
      await conn.rollback();
      console.log("err", error);
      return {
        status: "ERR",
        message: error.message || "Create promotion failed",
      };
    } finally {
      conn.release();
    }
  }

  async update(id: number, promotion: Promotion) {
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();

      const { code, carType, type, discountAmount, description, startDate, endDate } = promotion;

      const sql = "CALL updatePromotion(?, ?, ?, ?, ?, ?, ?, ?)";
      const values = [id, code, carType, type, discountAmount, description, startDate, endDate];
      await conn.execute(sql, values);

      await conn.commit();
      return { status: "OK", message: "Update promotion success" };
    } catch (error: any) {
      console.log("err", error);
      await conn.rollback();
      return {
        status: "ERR",
        message: error.message || "Update promotion failed",
      };
    } finally {
      conn.release();
    }
  }

  async deleteByCode(code: string) {
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();

      await conn.execute("CALL deletePromotionByCode(?)", [code]);

      await conn.commit();
      return { status: "OK", message: "Delete promotion success" };
    } catch (error: any) {
      await conn.rollback();
      return {
        status: "ERR",
        message: error.message || "Delete promotion failed",
      };
    } finally {
      conn.release();
    }
  }
}
