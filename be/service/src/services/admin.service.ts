import bcrypt from "bcrypt";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { ArrangeType } from "../@types/type";
import { ModelAdmin } from "../models/user";
import { convertToVietnamTime } from "../utils/convertTime";
import testEmail from "../utils/testEmail";

type Admin = {
  email: string;
  fullName: string;
  password: string;
  createAt: string;
  updateAt: string;
};

export class AdminService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  async total(): Promise<number> {
    const query = "SELECT COUNT(*) AS totalAdminList FROM user WHERE role = 'admin'";
    const [rows] = await this.db.execute(query);
    return (rows as RowDataPacket[])[0].totalAdminList;
  }

  async fetch(id: number): Promise<object> {
    const [rows] = await this.db.execute("CALL fetchAdmin(?)", [id]);
    if (rows[0].length === 0) {
      return {
        status: "ERR",
        message: "Admin not found",
      };
    }

    let detailAdmin: ModelAdmin = rows[0][0];
    detailAdmin.createAt = convertToVietnamTime(detailAdmin.createAt);
    detailAdmin.updateAt = convertToVietnamTime(detailAdmin.updateAt);
    return detailAdmin;
  }

  async getAll(
    limit: number,
    offset: number,
    arrangeType: ArrangeType
  ): Promise<{ status: string; total: number; totalPage: number; data: object[] }> {
    const totalCount = await this.total();
    const [row] = await this.db.execute("CALL getAdmins(?, ?, ?)", [limit, offset, arrangeType]);
    const dataAdmin: ModelAdmin[] = row[0].map((item: ModelAdmin) => {
      item.createAt = convertToVietnamTime(item.createAt);
      item.updateAt = convertToVietnamTime(item.updateAt);
      return item;
    });

    return {
      status: "OK",
      total: totalCount,
      totalPage: Math.ceil(totalCount / limit),
      data: totalCount > 0 ? dataAdmin : [],
    };
  }

  async add(newAdmin: Admin) {
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();

      const { email, fullName, password } = newAdmin;
      if (!testEmail(email)) {
        await conn.rollback();
        return {
          status: "ERR",
          message: "Invalid email",
        };
      }

      const hashPass = await bcrypt.hash(password, 10);
      const sql = "CALL addAdmin(?, ?, ?)";
      const values = [email, fullName, hashPass];
      const [rows] = (await conn.execute(sql, values)) as [ResultSetHeader];

      if (rows.affectedRows === 0) {
        await conn.rollback();
        return {
          status: "ERR",
          message: "Create Admin failed",
        };
      }

      await conn.commit();
      return {
        status: "OK",
        message: "Create Admin success",
      };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  async update(id: number, dataUpdate: Admin) {
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();

      const hashPass = await bcrypt.hash(dataUpdate.password, 10);
      const sql = "CALL updateAdmin(?, ?)";
      const values = [id, hashPass];
      const [rows] = (await conn.execute(sql, values)) as [ResultSetHeader];

      if (rows.affectedRows === 0) {
        await conn.rollback();
        return { status: "ERR", message: "Admin not found" };
      }

      await conn.commit();
      return { status: "OK" };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}
