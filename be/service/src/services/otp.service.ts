import { globalBookTicketsDB } from "../config/db";
import bcrypt from "bcrypt";

type OtpData = {
  otp: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: "customer" | "driver";
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
      const [result] = await globalBookTicketsDB.execute(query, [
        email,
        hash,
        passwordHash,
        fullName,
        role,
      ]);

      return { data: result };
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
      const [rowsCount] = await globalBookTicketsDB.execute(
        "SELECT count(otp) FROM otp WHERE email = ?",
        [email]
      );

      const length = rowsCount[0]["count(otp)"];
      console.log("length", length);

      const [rows] = await globalBookTicketsDB.execute(
        "SELECT email, full_name, password, otp FROM otp WHERE email = ?",
        [email]
      );

      const result = rows as OtpRecord[];

      console.log(result[length - 1]);

      return result.length > 0 ? result[length - 1] : null;
    } catch (error) {
      console.error("ERR findOtp", error);
      throw error;
    }
  }
}
