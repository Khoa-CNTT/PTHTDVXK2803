import bcrypt from "bcrypt";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import otpGenerator from "otp-generator";
import { bookBusTicketsDB } from "../config/db";
import { sendOtpEmail } from "./email.service";
import { CloudinaryAsset } from "../@types/cloudinary";
import { ArrangeType, UserRegister } from "../@types/type";
import { ModelCustomer } from "../models/user";
import { convertToVietnamTime } from "../utils/convertTime";
import deleteOldFile from "../utils/deleteOldFile.util";
import { UserService } from "./user.service";
import { generalAccessToken, generalRefreshToken } from "../services/auth.service";
import { OtpService } from "./otp.service";
import testEmail from "../utils/testEmail";
import { formatDate } from "../utils/formatDate";
import { UpdatePassword } from "../@types/user.type";

const userService = new UserService(bookBusTicketsDB);
const otpService = new OtpService();

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
            status: "E1",
            message: "Email này đã được sử dụng",
          });
        }

        const otp = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });

        const passwordHash = await bcrypt.hash(password, 10);
        const insertOtp = await otpService.insertOtp({
          otp,
          email,
          passwordHash,
          fullName,
          role: "customer",
        });
        if (insertOtp.data.status === "ERR") {
          return resolve({
            status: "ERR",
            message: insertOtp.data.message,
          });
        }

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

  insertOtp(email: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const [rows] = await this.db.execute("call fetchCustomerByEmail(?)", [email]);
        if (rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Customer not found",
          });
          return
        }

        const otp = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });

        const insertOtp = await otpService.insertOtpForgotPassword({otp,email });
        if (insertOtp.data.status === "ERR") {
          return resolve({
            status: "ERR",
            message: insertOtp.data.message,
          });
        }

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

   sendOtp(email: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {

        const otp = otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });

        const insertOtp = await otpService.insertOtpForgotPassword({otp,email });
        if (insertOtp.data.status === "ERR") {
          return resolve({
            status: "ERR",
            message: insertOtp.data.message,
          });
        }

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
        } else {
          const sql = `insert into user (email, full_name, password, role) values (?, ?, ?, ?)`;
          const values = [checkOtp.email, checkOtp.fullName, checkOtp.password, "customer"];

          const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];

          if (rows.affectedRows > 0) {
            const detailCustomer = {
              email: checkOtp.email,
              fullName: checkOtp.fullName,
              role: "customer",
            };

            const access_token = generalAccessToken({ id: email, role: "customer" });
            const refresh_token = generalRefreshToken({ id: email, role: "customer" });
            const expirationTime = Date.now() + 60 * 60 * 1000;

            return resolve({
              status: "OK",
              message: "Register success",
              data: detailCustomer,
              access_token,
              refresh_token,
              expirationTime,
            });
          }
        }
      } catch (error) {
        console.log("error", error);
        reject({
          status: "ERR",
          message: "Error verifying email",
        });
      }
    });
  }

  verifyEmailForgotPassword(email: string, otp: string): Promise<any> {
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
        } else {
            return resolve({
              status: "OK",
              message: "Verify email success",
            });
          }
      } catch (error) {
        console.log("error", error);
        reject({
          status: "ERR",
          message: "Error verifying email",
        });
      }
    });
  }


  fetch(id: number): Promise<object> {
    return new Promise(async (resolve, reject) => {
      try {
        const [rows] = await this.db.execute("call fetchCustomer(?)", [id]);
        if (rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Customer not found",
          });
        }

        let detailCus: ModelCustomer = rows[0][0];

        detailCus.createAt = formatDate(detailCus.createAt, "DD/MM/YYYY", true);
        detailCus.updateAt = formatDate(detailCus.updateAt, "DD/MM/YYYY", true);

        resolve(detailCus);
      } catch (error) {
        console.log("Err Service.getDetail", error);
        reject(error);
      }
    });
  }

  getDetailUserByEmail(email: String): Promise<object> {
    return new Promise(async (resolve, reject) => {
      try {
        const [rows] = await this.db.execute("call fetchCustomerByEmail(?)", [email]);
        if (rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Customer not found",
          });
        }
        resolve(rows[0][0]);
      } catch (error) {
        console.log("Err Service.getDetail", error);
        reject(error);
      }
    });
  }

  updateUser(updateCustomer: ModelCustomer,publicId: string | null, fileCloudinary: CloudinaryAsset): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { secure_url, public_id } = fileCloudinary;
        const [result] = await this.db.execute('select url_public_img as urlPublicImg from user where email = ?', [updateCustomer.email])
        const publicUrlImg = result[0][0]
        console.log('public-img', publicUrlImg)
        
        const sql = "call updateDetailUser( ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
          updateCustomer.email,
          updateCustomer.fullName,
          updateCustomer.sex,
          updateCustomer.phone,
          updateCustomer.dateBirth,
          updateCustomer.address,
          secure_url, 
          public_id
        ];


        if(publicId) {
          deleteOldFile(publicId, "image");
        }

        const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
        if (rows.affectedRows === 0) {
          return resolve({ status: "ERR", message: "User not found" });
        }

        const [rowsDataUser] =( await this.db.execute("call fetchCustomerByEmail(?)", [updateCustomer.email]) as [ResultSetHeader]);
        if (rowsDataUser.affectedRows <= 0) {
          resolve({
            status: "ERR",
            message: "Customer not found",
          });
        }

        resolve({
          status: "OK",
          user: rowsDataUser[0][0]
        });
      } catch (error) {
        reject(error);
      }
    });
  }

 
  update(id: number, updateCustomer: ModelCustomer): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const hashPass = await bcrypt.hash(updateCustomer.password, 10);
        const sql = "call updateCustomer( ?, ?, ?, ?, ?, ?, ?)";
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

  updateNoImage(updateCustomer: ModelCustomer): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = "call updateUserFromCustomer( ?, ?, ?, ?, ?, ?)";
        const values = [
          updateCustomer.email,
          updateCustomer.fullName,
          updateCustomer.sex,
          updateCustomer.phone,
          updateCustomer.dateBirth,
          updateCustomer.address,
        ];

        const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
        if (rows.affectedRows === 0) {
          return resolve({ status: "ERR", message: "Customer not found" });
        }
        
        const [rowsDataUser] =( await this.db.execute("call fetchCustomerByEmail(?)", [updateCustomer.email]) as [ResultSetHeader]);
        if (rowsDataUser.affectedRows <= 0) {
          resolve({
            status: "ERR",
            message: "Customer not found",
          });
          return
        }

        resolve({
          status: "OK",
          user: rowsDataUser[0][0]
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
    arrangeType: ArrangeType,
    emailSearch: string
  ): Promise<{ status: string; total: number; totalPage: number; data: object }> {
    return new Promise(async (resolve, reject) => {
      try {
        const totalCustomerCount = await this.total();
        const [row] = await this.db.execute("call getCustomers(?, ?, ?, ?)", [
          limit,
          offset,
          arrangeType,
          emailSearch,
        ]);
        let dataCustomer: ModelCustomer[] = row[0].map((item: ModelCustomer) => {
          item.createAt = formatDate(item.createAt, "DD/MM/YYYY", true);
          item.updateAt = formatDate(item.updateAt, "DD/MM/YYYY", true);
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

 updatePassword(dataUpdate: UpdatePassword): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const {email, passwordOld, passwordNew} = dataUpdate
        
      const [rows] = await this.db.execute("call getCustomer(?)", [email]);
        if (rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Customer not found",
          });
        }

        
        const compareCurrentPassword = await bcrypt.compareSync(
          passwordOld,
          rows[0][0].password
        );

        if (!compareCurrentPassword) {
          resolve({
            status: 'ERR',
            message: 'Verify password current is false',
          });
        }

        const comparePassword = bcrypt.compareSync(passwordNew, rows[0][0].password);

        const password= rows[0][0].password

        if (comparePassword) {
          resolve({
            status: 'ERR',
            message: 'Nothing changes',
          });
        } else {
          const hash = bcrypt.hashSync(passwordNew, 10);

          const sql = "call updatePassword( ?, ?, ?)";
          const values = [
            email,
            password
            ,
            hash
          ];

          const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
          if (rows.affectedRows === 0) {
            return resolve({ status: "ERR", message: "Customer not found" });
          }
          resolve({
            status: "OK",
            message: "Update password success",
          });
      }
        
      } catch (error) {
        reject(error);
      }
    });
  }

  updateNewPassword(dataUpdate: UpdatePassword): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const {email, passwordNew} = dataUpdate
        
      const [rows] = await this.db.execute("call getCustomer(?)", [email]);
        if (rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Customer not found",
          });
        }
          const hash = bcrypt.hashSync(passwordNew, 10);

          const sql = "call updateForgotPassword( ?, ?)";
          const values = [
            email,
            hash
          ];

          const [rowsUpdate] = (await this.db.execute(sql, values)) as [ResultSetHeader];
          if (rowsUpdate.affectedRows === 0) {
            return resolve({ status: "ERR", message: "Customer not found" });
          }
          resolve({
            status: "OK",
            message: "Update password success",
          });
        
      } catch (error) {
        reject(error);
      }
    });
  }
  add(newCustomer: ModelCustomer, fileCloudinary: CloudinaryAsset): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!testEmail(newCustomer.email)) {
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
        const sql = "call saveCustomer(?, ?, ?, ?, ?)";
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
