import { globalBookTicketsDB } from "../config/db";

interface TokenData {
  id: string;
  role: string;
}

export class UserService {
  private db;
  constructor(db: any) {
    this.db = db;
  }
  decodeToken(token: string): TokenData | null {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { id: payload.id, role: payload.role };
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }

  // Method to check if the user is an admin
  isAdmin(token: string): boolean {
    const decoded = this.decodeToken(token);
    return decoded ? decoded.role === "admin" : false;
  }

  async checkUser(email: string): Promise<boolean> {
    const [rows] = await this.db.execute(
      "select count(email) as countUser from usr where email = ?",
      [email]
    );
    const countUser = (rows as any)[0].countUser;
    return countUser > 0 ? true : false;
  }

  async getUserByEmail(email: string): Promise<any> {
    const [rows] = await this.db.execute("select * from user where email = ?", [email]);
    return rows[0][0];
  }
}
