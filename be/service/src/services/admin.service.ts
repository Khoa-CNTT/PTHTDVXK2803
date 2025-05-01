import bcrypt from "bcrypt";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { CloudinaryAsset } from "../@types/cloudinary";
import { ArrangeType } from "../@types/type";
import { ModelAdmin } from "../models/user";
import { convertToVietnamTime } from "../utils/convertTime";
import deleteOldFile from "../utils/deleteOldFile.util";
import testEmail from "../utils/testEmail";

type Admin = {
  email: string;
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
    try {
      const query = "select count(*) as totalAdminList from user where role = 'admin'";
      const [rows] = await this.db.execute(query);
      return (rows as RowDataPacket[])[0].totalAdminList;
    } catch (error) {
      throw error;
    }
  }

  fetch(id: number): Promise<object> {
    return new Promise(async (resolve, reject) => {
      try {
        const [rows] = await this.db.execute("call fetchAdmin(?)", [id]);
        if (rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Admin not found",
          });
        }

        let detailAdmin: ModelAdmin = rows[0][0];

        detailAdmin.createAt = convertToVietnamTime(detailAdmin.createAt);
        detailAdmin.updateAt = convertToVietnamTime(detailAdmin.updateAt);

        resolve(detailAdmin);
      } catch (error) {
        console.log("Err Service.getDetail", error);
        reject(error);
      }
    });
  }

  update(id: number, dataUpdate: Admin): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const hashPass = await bcrypt.hash(dataUpdate.password, 10);
        const sql = "call updateAdmin( ?, ?)";
        const values = [id, hashPass];

        const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
        if (rows.affectedRows === 0) {
          return resolve({ status: "ERR", message: "Admin not found" });
        }
        resolve({
          status: "OK",
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getAll(
    limit: number,
    offset: number,
    arrangeType: ArrangeType
  ): Promise<{ status: string; total: number; totalPage: number; data: object }> {
    return new Promise(async (resolve, reject) => {
      try {
        const totalCustomerCount = await this.total();
        const [row] = await this.db.execute("call getAdmins(?, ?, ?)", [
          limit,
          offset,
          arrangeType,
        ]);
        let dataAdmin: ModelAdmin[] = row[0].map((item: ModelAdmin) => {
          item.createAt = convertToVietnamTime(item.createAt);
          item.updateAt = convertToVietnamTime(item.updateAt);
          return item;
        });
        resolve({
          status: "OK",
          total: totalCustomerCount,
          totalPage: Math.ceil(totalCustomerCount / limit),
          data: totalCustomerCount > 0 ? dataAdmin : [],
        });
      } catch (error) {
        console.error("Err Service.getall", error);
        reject(error);
      }
    });
  }

  add(newAdmin: Admin): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!testEmail(newAdmin.email)) {
          return reject({
            status: "ERR",
            message: "Invalid email",
          });
        }
        const hashPass = await bcrypt.hash(newAdmin.password, 10);
        const sql = "call addAdmin(?, ?)";
        const values = [newAdmin.email, hashPass];
        const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
        if (rows.affectedRows === 0) {
          return reject({
            status: "ERR",
            message: "Create Admin failed",
          });
        }
        resolve({
          status: "OK",
          message: "Create Admin success",
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
