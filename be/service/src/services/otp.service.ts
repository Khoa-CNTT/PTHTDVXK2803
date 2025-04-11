import { globalBookTicketsDB } from "../config/db";
import bcrypt from "bcrypt";

interface OtpData {
  otp: string;
  email: string;
  passwordHash: string;
  fullName: string;
}

interface OtpRecord {
  email: string;
  fullName: string;
  password: string;
  otp: string;
}

const insertOtp = ({ otp, email, passwordHash, fullName }: OtpData): Promise<{ data: any }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(otp, salt);

      const query = "call upsert_otp(?, ?, )";
      const [result] = await globalBookTicketsDB.execute(query, [
        email,
        hash,
        passwordHash,
        fullName,
      ]);

      resolve({
        data: result,
      });
    } catch (error) {
      console.error("ERR Insert OTP", error);
      reject(error);
    }
  });
};

const isValidOtp = async (otp: string, hashOtp: string): Promise<boolean> => {
  try {
    const isValid = await bcrypt.compare(otp, hashOtp);
    return isValid;
  } catch (error) {
    console.error(error);
    return false; // Return false in case of error
  }
};

const findOtp = async (email: string): Promise<OtpRecord | null> => {
  try {
    const [rowsCount] = await globalBookTicketsDB.execute(
      "SELECT count(otp) FROM otp WHERE email = ?",
      [email]
    );

    // The result from rowsCount is an array with one element: [ { count: number } ]
    const length = rowsCount[0]["count(otp)"];
    console.log("length", length);

    const [rows] = await globalBookTicketsDB.execute(
      "SELECT email, name, password, otp FROM otp WHERE email = ?",
      [email]
    );

    // Ensure `rows` is typed as an array of `OtpRecord` type, which will have the `length` property
    const result = rows as OtpRecord[];

    console.log(result[length - 1]);

    return result.length > 0 ? result[length - 1] : null;
  } catch (error) {
    console.error("ERR findOtp", error);
    throw error;
  }
};

export { insertOtp, isValidOtp, findOtp };
