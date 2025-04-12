import bcrypt from "bcrypt";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import otpGenerator from "otp-generator";
import { globalBookTicketsDB } from "../config/db";
import { sendOtpEmail } from "./email.service";
import { CloudinaryAsset } from "../@types/cloudinary";
import { ArrangeType, UserRegister } from "../@types/type";
import { CustomerType } from "../@types/customer";
import { convertToVietnamTime } from "../utils/convertTime";
import deleteOldFile from "../utils/deleteOldFile.util";
import { UserService } from "./user.service";
import { generalAccessToken, generalRefreshToken } from "../utils/jwt.util";
import { OtpService } from "./otp.service";

const otpService = new OtpService();

type Customer = {
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

const userService = new UserService(globalBookTicketsDB);

export class CustomerService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  async total(): Promise<number> {
    try {
      const query = "select count(*) as totalCustomerList from user where role = 'customer'";
      const [rows] = await this.db.execute(query);
      return (rows as RowDataPacket[])[0].totalCustomerList;
    } catch (error) {
      throw error;
    }
  }

  register(newCustomer: UserRegister): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { email, password, fullName, confirmPassword } = newCustomer;

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
        await otpService.insertOtp({ otp, email, passwordHash, fullName, role: "customer" });
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
          const values = [checkOtp.email, checkOtp.fullName, checkOtp.password, "customer"];

          const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];

          if (rows.affectedRows > 0) {
            const access_token = generalAccessToken({ id: email, role: "customer" });
            const refresh_token = generalRefreshToken({ id: email, role: "customer" });

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
        const [rows] = await this.db.execute("call fetch_customer(?)", [id]);
        if (rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Customer not found",
          });
        }

        let detailCus: CustomerType = rows[0][0];

        detailCus.createAt = convertToVietnamTime(detailCus.createAt);
        detailCus.updateAt = convertToVietnamTime(detailCus.updateAt);
        detailCus.dateBirth = convertToVietnamTime(detailCus.dateBirth);

        resolve(detailCus);
      } catch (error) {
        console.log("Err Service.getDetail", error);
        reject(error);
      }
    });
  }

  update(id: number, updateCustomer: Customer): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const hashPass = await bcrypt.hash(updateCustomer.password, 10);
        const sql = "call update_customer( ?, ?, ?, ?, ?, ?, ?)";
        const values = [
          id,
          updateCustomer.fullName,
          updateCustomer.sex,
          hashPass,
          updateCustomer.phone,
          updateCustomer.dateBirth,
          updateCustomer.address,
        ];

        const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
        if (rows.affectedRows === 0) {
          return resolve({ status: "ERR", message: "Customer not found" });
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
              message: "Customer not found",
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
        const totalCustomerCount = await this.total();
        const [row] = await this.db.execute("call get_all_customer(?, ?, ?)", [
          limit,
          offset,
          arrangeType,
        ]);
        let dataCustomer: CustomerType[] = row[0].map((item: CustomerType) => {
          item.createAt = convertToVietnamTime(item.createAt);
          item.updateAt = convertToVietnamTime(item.updateAt);
          item.dateBirth = convertToVietnamTime(item.dateBirth);
          return item;
        });
        resolve({
          status: "OK",
          total: totalCustomerCount,
          totalPage: Math.ceil(totalCustomerCount / limit),
          data: totalCustomerCount > 0 ? dataCustomer : [],
        });
      } catch (error) {
        console.error("Err Service.getall", error);
        reject(error);
      }
    });
  }

  add(newCustomer: Customer, fileCloudinary: CloudinaryAsset): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.(com|vn|org|edu|net)$/;
        console.log("newCustomer-ser", newCustomer);
        if (!regex.test(newCustomer.email)) {
          console.log('"Invalid email format", newCustomer.email);');
          deleteOldFile(fileCloudinary.public_id, "image");
          return reject({
            status: "ERR",
            message: "Invalid email",
          });
        }
        const hashPass = await bcrypt.hash(newCustomer.password, 10);
        const sql = "call addCustomer(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
          newCustomer.email,
          newCustomer.fullName,
          newCustomer.sex,
          hashPass,
          fileCloudinary ? fileCloudinary.secure_url : null,
          fileCloudinary ? fileCloudinary.public_id : null,
          newCustomer.phone,
          newCustomer.dateBirth,
          newCustomer.address,
        ];
        const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
        if (rows.affectedRows === 0) {
          deleteOldFile(fileCloudinary.public_id, "image");
          return reject({
            status: "ERR",
            message: "Create customer failed",
          });
        }
        resolve({
          status: "OK",
          message: "Create customer success",
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  save(profile: any, provider: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { id, email, displayName, photos } = profile;
        const sql = "call save_customer(?, ?, ?, ?, ?)";
        const values = [email, id, provider, displayName, photos];
        await this.db.execute(sql, values);
        resolve({
          status: "OK",
          message: "Save customer success",
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
