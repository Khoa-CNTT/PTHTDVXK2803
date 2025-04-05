import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2/promise";
import otpGenerator from "otp-generator";
import { bookBusTicketsDB, globalBookTicketsDB } from "../config/db";
import { generalAccessToken, generalRefreshToken } from "../utils/jwt.util";
import { sendOtpEmail } from "./email.service";
import { findOtp, insertOtp, isValidOtp } from "./otp.service";
import { CloudinaryAsset } from "../@types/cloudinary";
import { ArrangeType } from "../@types/type";
import { log } from "../utils/logger";

interface Customer {
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
  // urlImg?: string;
  // urlPublicImg: string;
  phone?: string;
  dayBirth?: string;
  address?: string;
}

interface CustomerLogin {
  email: string;
  password: string;
}

interface TokenData {
  id: string;
  role: string;
}

const totalCustomer = async (): Promise<number> => {
  try {
    const query = "select count(*) as totalCustomerList from customer";
    const [rows] = await (await globalBookTicketsDB).execute(query);
    return (rows as RowDataPacket[])[0].totalCustomerList;
  } catch (error) {
    throw error;
  }
};

export const countCustomer = async (): Promise<number> => {
  try {
    const query = "select count(*) from customer";
    const [rows] = await (await globalBookTicketsDB).execute(query);
    const result = rows[0]["count(*)"];
    return result;
  } catch (error) {
    throw error;
  }
};

// export const registerSer = (newCustomer: NewCustomer): Promise<any> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const { email, password, lastName } = newCustomer;

//       const checkPerson = await checkUser(email);
//       if (checkPerson) {
//         return resolve({
//           status: "ERR",
//           message: "This user already exists",
//         });
//       }

//       const otp = otpGenerator.generate(6, {
//         digits: true,
//         lowerCaseAlphabets: false,
//         upperCaseAlphabets: false,
//         specialChars: false,
//       });

//       const passwordHash = await bcrypt.hash(password, 10);
//       await insertOtp({ otp, email, passwordHash });
//       await sendOtpEmail({ email, otp });

//       resolve({
//         status: "OK",
//         message: "Create OTP success",
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// export const verifyEmailSer = (email: string, otp: string): Promise<any> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const checkOtp = await findOtp(email);

//       if (!checkOtp) {
//         return resolve({
//           status: "ERR",
//           message: "The OTP code for this email does not exist",
//         });
//       }

//       const isValid = await isValidOtp(otp, checkOtp.otp);

//       if (!isValid) {
//         return resolve({
//           status: "ERR",
//           message: "Error verifying email",
//         });
//       }

//       if (isValid && email === checkOtp.email) {
//         const count = await countCustomer();
//         const userId = count < 9 ? `CTM0${count + 1}` : `CTM${count + 1}`;

//         const sqlPerson = `INSERT INTO person (id, email, name, password, role_id, status_id) VALUES (?, ?, ?, ?, ?, ?)`;
//         const values = [userId, checkOtp.email, checkOtp.name, checkOtp.password, "CTM", "PS01"];

//         await (await globalBookTicketsDB).query(sqlPerson, values);

//         const sqlCustomer = `INSERT INTO customer (id) VALUES (?)`;
//         await (await globalBookTicketsDB).query(sqlCustomer, [userId]);

//         const newUser = await checkUser(email);
//         if (newUser) {
//           const access_token = generalAccessToken({ id: newUser.id, role: newUser.role });
//           const refresh_token = generalRefreshToken({ id: newUser.id, role: newUser.role });

//           return resolve({
//             status: "OK",
//             message: "Register success",
//             access_token,
//             refresh_token,
//           });
//         }
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// export const loginSer = (customerLogin: CustomerLogin): Promise<any> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const checkPerson = await checkUser(customerLogin.email);
//       if (checkPerson === null) {
//         resolve({
//           status: "ERR",
//           message: "The user is not defined",
//         });
//       } else {
//         const comparePass = await bcrypt.compareSync(customerLogin.password, checkPerson.password);
//         if (!comparePass) {
//           resolve({
//             status: "ERR",
//             message: "Password error",
//           });
//         } else {
//           const access_token = generalAccessToken({
//             id: checkPerson?.id,
//             role: checkPerson?.role,
//           });

//           const refresh_token = generalRefreshToken({
//             id: checkPerson?.id,
//             role: checkPerson?.role,
//           });

//           resolve({
//             status: "OK",
//             message: "Login success",
//             access_token,
//             refresh_token,
//           });
//         }
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

export const fetchCustomerSer = (id: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const [row] = await globalBookTicketsDB.execute("call fetch_customer(?)", [id]);
      resolve({
        status: "OK",
        data: row[0],
      });
    } catch (error) {
      console.log("Err Service.getDetail", error);
    }
  });
};

export const updateCustomerSer = (
  id: number,
  updateCustomer: Customer,
  fileCloudinary: CloudinaryAsset
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPass = await bcrypt.hash(updateCustomer.password, 10);
      const sql = "call update_customer( ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const values = [
        id,
        updateCustomer.firstName,
        updateCustomer.lastName,
        hashPass,
        fileCloudinary.secure_url,
        fileCloudinary.public_id,
        updateCustomer.phone,
        updateCustomer.dayBirth,
        updateCustomer.address,
      ];

      await globalBookTicketsDB.execute(sql, values);
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
): Promise<{ status: string; total: number; data: object }> => {
  return new Promise(async (resolve, reject) => {
    try {
      log(`offset: ${offset}`);
      const totalCustomerCount = await totalCustomer();
      const [row] = await globalBookTicketsDB.execute("call get_all_customer(?, ?, ?)", [
        limit,
        offset,
        arrangeType,
      ]);
      resolve({
        status: "OK",
        total: totalCustomerCount,
        data: row[0],
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
    console.log(fileCloudinary);
    try {
      const regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.(com|vn|org|edu|net)$/;
      if (!regex.test(newCustomer.email)) {
        return resolve({
          status: "ERR",
          message: "Invalid email",
        });
      }
      const hashPass = await bcrypt.hash(newCustomer.password, 10);
      const sql = "call insert_customer(?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const values = [
        newCustomer.email,
        newCustomer.firstName,
        newCustomer.lastName,
        hashPass,
        fileCloudinary ? fileCloudinary.secure_url : null,
        fileCloudinary ? fileCloudinary.public_id : null,
        newCustomer.phone,
        newCustomer.dayBirth,
        newCustomer.address,
      ];

      await globalBookTicketsDB.execute(sql, values);
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
