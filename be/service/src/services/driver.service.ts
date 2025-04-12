import bcrypt from "bcrypt";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import otpGenerator from "otp-generator";
import { globalBookTicketsDB } from "../config/db";
import { sendOtpEmail } from "./email.service";
import { CloudinaryAsset } from "../@types/cloudinary";
import { ArrangeType, UserRegister } from "../@types/type";
import { convertToVietnamTime } from "../utils/convertTime";
import deleteOldFile from "../utils/deleteOldFile.util";
import { UserService } from "./user.service";
import { generalAccessToken, generalRefreshToken } from "../utils/jwt.util";
import { DriverType } from "../@types/driver";
import { OtpService } from "./otp.service";

const userService = new UserService(globalBookTicketsDB);
const otpService = new OtpService();

export class DriverService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  async total(): Promise<number> {
    try {
      const query = "select count(*) as totalDriverList from user where role = 'driver'";
      const [rows] = await this.db.execute(query);
      return (rows as RowDataPacket[])[0].totalDriverList;
    } catch (error) {
      throw error;
    }
  }

  register(newDriver: UserRegister): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { email, password, fullName, confirmPassword } = newDriver;

        if (password !== confirmPassword) {
          return resolve({
            status: "ERR",
            message: "Password and confirm password do not match",
          });
        }

        const checkPerson = await userService.checkUser(email);
        if (checkPerson) {
          return resolve({
            status: "ERR",
            message: "This user already exists",
          });
        }

        const otp = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });

        const passwordHash = await bcrypt.hash(password, 10);
        await otpService.insertOtp({ otp, email, passwordHash, fullName, role: "driver" });
        await sendOtpEmail({ email, otp });

        resolve({
          status: "OK",
          message: "Create OTP success",
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  verifyEmail(email: string, otp: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const checkOtp = await otpService.findOtp(email);

        if (!checkOtp) {
          return resolve({
            status: "ERR",
            message: "The OTP code for this email does not exist",
          });
        }

        const isValid = await otpService.isValidOtp(otp, checkOtp.otp);

        if (!isValid) {
          return resolve({
            status: "ERR",
            message: "Error verifying email",
          });
        }

        if (isValid && email === checkOtp.email) {
          const sql = `insert into user (email, password, fullName, role) values (?, ?, ?, ?)`;
          const values = [checkOtp.email, checkOtp.fullName, checkOtp.password, "driver"];

          const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];

          if (rows.affectedRows > 0) {
            const access_token = generalAccessToken({ id: email, role: "driver" });
            const refresh_token = generalRefreshToken({ id: email, role: "driver" });

            return resolve({
              status: "OK",
              message: "Register success",
              access_token,
              refresh_token,
            });
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  fetch(id: number): Promise<object> {
    return new Promise(async (resolve, reject) => {
      try {
        const [rows] = await this.db.execute("call fetch_driver(?)", [id]);
        if (rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Driver not found",
          });
        }

        let detailDriver: DriverType = rows[0][0];

        detailDriver.createAt = convertToVietnamTime(detailDriver.createAt);
        detailDriver.updateAt = convertToVietnamTime(detailDriver.updateAt);
        detailDriver.dateBirth = convertToVietnamTime(detailDriver.dateBirth);
        detailDriver.experienceYears = convertToVietnamTime(detailDriver.experienceYears);

        resolve(detailDriver);
      } catch (error) {
        console.log("Err Service.getDetail", error);
        reject(error);
      }
    });
  }

  update(id: number, updateDriver: DriverType): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const hashPass = await bcrypt.hash(updateDriver.password, 10);
        const sql = "call update_driver( ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
          id,
          updateDriver.fullName,
          updateDriver.sex,
          hashPass,
          updateDriver.licenseNumber,
          updateDriver.experienceYears,
          updateDriver.phone,
          updateDriver.dateBirth,
          updateDriver.address,
        ];

        const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
        if (rows.affectedRows === 0) {
          return resolve({ status: "ERR", message: "Driver not found" });
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

        const sql = "call update_image_user( ?, ?, ?)";
        const values = [id, secure_url, public_id];

        const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
        if (publicId) {
          if (rows.affectedRows === 0) {
            return resolve({
              status: "ERR",
              message: "Update driver failed",
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
    arrangeType: ArrangeType
  ): Promise<{ status: string; total: number; totalPage: number; data: object }> {
    return new Promise(async (resolve, reject) => {
      try {
        const totalCount = await this.total();
        const [row] = await this.db.execute("call get_all_driver(?, ?, ?)", [
          limit,
          offset,
          arrangeType,
        ]);
        let dataCustomer: DriverType[] = row[0].map((item: DriverType) => {
          item.createAt = convertToVietnamTime(item.createAt);
          item.updateAt = convertToVietnamTime(item.updateAt);
          item.dateBirth = convertToVietnamTime(item.dateBirth);
          return item;
        });
        resolve({
          status: "OK",
          total: totalCount,
          totalPage: Math.ceil(totalCount / limit),
          data: totalCount > 0 ? dataCustomer : [],
        });
      } catch (error) {
        console.error("Err Service.getall", error);
        reject(error);
      }
    });
  }

  add(newDriver: DriverType, fileCloudinary: CloudinaryAsset): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.(com|vn|org|edu|net)$/;
        console.log("newDriver-ser", newDriver);
        if (!regex.test(newDriver.email)) {
          console.log('"Invalid email format", newDriver.email);');
          deleteOldFile(fileCloudinary.public_id, "image");
          return reject({
            status: "ERR",
            message: "Invalid email",
          });
        }
        const hashPass = await bcrypt.hash(newDriver.password, 10);
        const sql = "call addDriver(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
          newDriver.email,
          newDriver.fullName,
          newDriver.sex,
          hashPass,
          newDriver.licenseNumber,
          newDriver.experienceYears,
          fileCloudinary ? fileCloudinary.secure_url : null,
          fileCloudinary ? fileCloudinary.public_id : null,
          newDriver.phone,
          newDriver.dateBirth,
          newDriver.address,
        ];
        const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
        console.log("affectedRows", rows.affectedRows);
        if (rows.affectedRows < 1 || !rows.affectedRows) {
          deleteOldFile(fileCloudinary.public_id, "image");
          return reject({
            status: "ERR",
            message: "Create driver failed",
          });
        }
        resolve({
          status: "OK",
          message: "Create driver success",
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
