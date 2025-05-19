import { ResultSetHeader } from "mysql2";
import { bookBusTicketsDB } from "../config/db";
import bcrypt from "bcrypt";

type OtpData = {
  otp: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: "customer" | "driver";
};

type OtpDataForgotPassword = {
  otp: string;
  email: string;
};

interface OtpRecord {
  email: string;
  fullName: string;
  password: string;
  otp: string;
}

export class OtpService {
  async insertOtp({ otp, email, passwordHash, fullName, role }: OtpData): Promise<{ data: any }> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(otp, salt);

      const query = "call upsert_otp(?, ?, ?, ?, ?)";
      const value = [email, hash, passwordHash, fullName, role];
      const [result, fields] = (await bookBusTicketsDB.execute(query, value)) as [
        ResultSetHeader,
        any
      ];

      if (result.affectedRows <= 0) {
        return { data: { status: "ERR", message: "Create OTP failed" } };
      } else {
        return { data: result };
      }
    } catch (error) {
      console.error("ERR Insert OTP", error);
      throw error;
    }
  }


   async insertOtpForgotPassword({ otp, email }: OtpDataForgotPassword): Promise<{ data: any }> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(otp, salt);

      const query = "call upsert_otp_forgot_password(?, ?)";
      const value = [email, hash];
      const [result, fields] = (await bookBusTicketsDB.execute(query, value)) as [
        ResultSetHeader,
        any
      ];

      if (result.affectedRows <= 0) {
        return { data: { status: "ERR", message: "Create OTP failed" } };
      } else {
        return { data: result };
      }
    } catch (error) {
      console.error("ERR Insert OTP", error);
      throw error;
    }
  }

  async isValidOtp(otp: string, hashOtp: string): Promise<boolean> {
    try {
      return await bcrypt.compare(otp, hashOtp);
    } catch (error) {
      console.error("ERR Compare OTP", error);
      return false;
    }
  }

  async findOtp(email: string): Promise<OtpRecord | null> {
    try {
      const [rows] = await bookBusTicketsDB.execute(
        "SELECT email, full_name as fullName, password, otp FROM otp WHERE email = ?",
        [email]
      );

      const result: OtpRecord = rows[0];

      if (!result) {
        return null;
      } else {
        return result;
      }
    } catch (error) {
      throw error;
    }
  }
}
