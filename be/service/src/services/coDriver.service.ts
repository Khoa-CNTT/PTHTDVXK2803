import bcrypt from "bcrypt";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { CloudinaryAsset } from "../@types/cloudinary";
import { ArrangeType } from "../@types/type";
import { ModelCoDriver } from "../models/user";
import { convertToVietnamTime } from "../utils/convertTime";
import deleteOldFile from "../utils/deleteOldFile.util";
import testEmail from "../utils/testEmail";
import { formatDate } from "../utils/formatDate";

type CoDriver = {
  currentLocationId?: number;
  email: string;
  fullName?: string;
  sex?: "male" | "female" | "other";
  password: string;
  urlImg?: string;
  urlPublicImg?: string;
  phone?: string;
  dateBirth?: string;
  address?: string;
};

export class CoDriverService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  async total(): Promise<number> {
    try {
      const query = "select count(*) as totalCoDriverList from user where role = 'co-driver'";
      const [rows] = await this.db.execute(query);
      return (rows as RowDataPacket[])[0].totalCoDriverList;
    } catch (error) {
      throw error;
    }
  }

  fetch(id: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const [rows] = await this.db.execute("call fetchCoDriver(?)", [id]);
        if (rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Co-driver not found",
          });
        }

        let detailCoDriver: ModelCoDriver = rows[0][0];

        detailCoDriver.createAt = formatDate(detailCoDriver.createAt, "MM/DD/YYYY", true);
        detailCoDriver.updateAt = formatDate(detailCoDriver.updateAt, "MM/DD/YYYY", true);

        resolve(detailCoDriver);
      } catch (error) {
        console.log("Err Service.getDetail", error);
        reject(error);
      }
    });
  }

  update(id: number, dataUpdate: CoDriver): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const hashPass = await bcrypt.hash(dataUpdate.password, 10);
        const sql = "call updateCoDriver( ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
          id,
          dataUpdate.currentLocationId,
          dataUpdate.fullName,
          dataUpdate.sex,
          hashPass,
          dataUpdate.phone,
          dataUpdate.dateBirth,
          dataUpdate.address,
        ];

        const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
        if (rows.affectedRows === 0) {
          return resolve({ status: "ERR", message: "Co-driver not found" });
        }
        resolve({
          status: "OK",
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  updateImage(id: number, publicId: string | null, fileCloudinary: CloudinaryAsset): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { secure_url, public_id } = fileCloudinary;

        const sql = "call updateImageUser( ?, ?, ?)";
        const values = [id, secure_url, public_id];

        const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
        if (publicId) {
          if (rows.affectedRows === 0) {
            return resolve({
              status: "ERR",
              message: "Co-driver not found",
            });
          } else {
            deleteOldFile(publicId, "image");
          }
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
    arrangeType: ArrangeType,
    phoneSearch: string
  ): Promise<{ status: string; total: number; totalPage: number; data: object }> {
    return new Promise(async (resolve, reject) => {
      try {
        const totalCustomerCount = await this.total();
        const [row] = await this.db.execute("call getCoDrivers(?, ?, ?, ?)", [
          limit,
          offset,
          arrangeType,
          phoneSearch,
        ]);
        let dataCoDriver: ModelCoDriver[] = row[0].map((item: ModelCoDriver) => {
          item.createAt = convertToVietnamTime(item.createAt);
          item.updateAt = convertToVietnamTime(item.updateAt);
          item.dateBirth = convertToVietnamTime(item.dateBirth);
          return item;
        });
        resolve({
          status: "OK",
          total: totalCustomerCount,
          totalPage: Math.ceil(totalCustomerCount / limit),
          data: totalCustomerCount > 0 ? dataCoDriver : [],
        });
      } catch (error) {
        console.error("Err Service.getall", error);
        reject(error);
      }
    });
  }

  add(newCoDriver: CoDriver, fileCloudinary: CloudinaryAsset): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!testEmail(newCoDriver.email)) {
          deleteOldFile(fileCloudinary.public_id, "image");
          return reject({
            status: "ERR",
            message: "Invalid email",
          });
        }
        const hashPass = await bcrypt.hash(newCoDriver.password, 10);
        const sql = "call addCoDriver(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
          newCoDriver.currentLocationId,
          newCoDriver.email,
          newCoDriver.fullName,
          newCoDriver.sex,
          hashPass,
          fileCloudinary ? fileCloudinary.secure_url : null,
          fileCloudinary ? fileCloudinary.public_id : null,
          newCoDriver.phone,
          newCoDriver.dateBirth,
          newCoDriver.address,
        ];
        
        const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
        if (rows.affectedRows === 0) {
          deleteOldFile(fileCloudinary.public_id, "image");
          return reject({
            status: "ERR",
            message: "Create co-driver failed",
          });
        }
        resolve({
          status: "OK",
          message: "Create co-driver success",
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
