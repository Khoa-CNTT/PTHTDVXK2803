import bcrypt from "bcrypt";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import otpGenerator from "otp-generator";
import { globalBookTicketsDB } from "../config/db";
import { sendOtpEmail } from "./email.service";
import { findOtp, insertOtp, isValidOtp } from "./otp.service";
import { CloudinaryAsset } from "../@types/cloudinary";
import { ArrangeType } from "../@types/type";
import { CustomerLogin, CustomerRegister, CustomerType } from "../@types/customer";
import { convertToVietnamTime } from "../utils/convertTime";
import deleteOldFile from "../utils/deleteOldFile.util";
import { UserService } from "./user.service";
import { generalAccessToken, generalRefreshToken } from "../utils/jwt.util";

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

const totalCustomer = async (): Promise<number> => {
  try {
    const query = "select count(*) as totalCustomerList from user where role = 'customer'";
    const [rows] = await (await globalBookTicketsDB).execute(query);
    return (rows as RowDataPacket[])[0].totalCustomerList;
  } catch (error) {
    throw error;
  }
};

export const registerSer = (newCustomer: CustomerRegister): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password, fullName } = newCustomer;

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
      await insertOtp({ otp, email, passwordHash, fullName });
      await sendOtpEmail({ email, otp });

      resolve({
        status: "OK",
        message: "Create OTP success",
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const verifyEmailSer = (email: string, otp: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOtp = await findOtp(email);

      if (!checkOtp) {
        return resolve({
          status: "ERR",
          message: "The OTP code for this email does not exist",
        });
      }

      const isValid = await isValidOtp(otp, checkOtp.otp);

      if (!isValid) {
        return resolve({
          status: "ERR",
          message: "Error verifying email",
        });
      }

      if (isValid && email === checkOtp.email) {
        const sql = `insert into user (email, password, fullName, role) values (?, ?, ?, ?)`;
        const values = [checkOtp.email, checkOtp.fullName, checkOtp.password, "customer"];

        const [rows] = await globalBookTicketsDB.execute<ResultSetHeader>(sql, values);

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
};

export const loginSer = (customerLogin: CustomerLogin): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPerson = await userService.getUserByEmail(customerLogin.email);
      if (checkPerson === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      } else {
        const comparePass = await bcrypt.compareSync(customerLogin.password, checkPerson.password);
        if (!comparePass) {
          resolve({
            status: "ERR",
            message: "Password error",
          });
        } else {
          const access_token = generalAccessToken({
            id: checkPerson?.id,
            role: checkPerson?.role,
          });

          const refresh_token = generalRefreshToken({
            id: checkPerson?.id,
            role: checkPerson?.role,
          });

          resolve({
            status: "OK",
            message: "Login success",
            access_token,
            refresh_token,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const fetchCustomerSer = (id: number): Promise<object> => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await globalBookTicketsDB.execute("call fetch_customer(?)", [id]);
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
};

export const updateCustomerSer = (id: number, updateCustomer: Customer): Promise<any> => {
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

      const [rows] = await globalBookTicketsDB.execute<ResultSetHeader>(sql, values);
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
};

export const updateImageCustomerSer = (
  id: number,
  publicId: string | null,
  fileCloudinary: CloudinaryAsset
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { secure_url, public_id } = fileCloudinary;

      const sql = "call update_image_user( ?, ?, ?)";
      const values = [id, secure_url, public_id];

      const [rows] = await globalBookTicketsDB.execute<ResultSetHeader>(sql, values);
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
};

export const deleteCustomerSer = (id: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      await globalBookTicketsDB.execute("call delete_customer(?)", [id]);
      resolve({
        status: "OK",
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllCustomerSer = (
  limit: number,
  offset: number,
  arrangeType: ArrangeType
): Promise<{ status: string; total: number; totalPage: number; data: object }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalCustomerCount = await totalCustomer();
      const [row] = await globalBookTicketsDB.execute("call get_all_customer(?, ?, ?)", [
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
};

export const addCustomerSer = (
  newCustomer: Customer,
  fileCloudinary: CloudinaryAsset
): Promise<any> => {
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
      console.log("values", values);
      const [rows] = await globalBookTicketsDB.execute<ResultSetHeader>(sql, values);
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
};

export const saveCustomerSer = (profile: any, provider: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id, email, displayName, photos } = profile;
      const sql = "call save_customer(?, ?, ?, ?, ?)";
      const values = [email, id, provider, displayName, photos];
      await globalBookTicketsDB.execute(sql, values);
      resolve({
        status: "OK",
        message: "Save customer success",
      });
    } catch (error) {
      reject(error);
    }
  });
};
