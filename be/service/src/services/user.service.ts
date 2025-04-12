import { bcrypt } from "bcrypt";
import { generalAccessToken, generalRefreshToken } from "../utils/jwt.util";

interface TokenData {
  id: string;
  role: string;
}

interface LoginType {
  email: string;
  password: string;
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

  login(userLogin: LoginType): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const checkPerson = await this.getUserByEmail(userLogin.email);
        if (checkPerson === null) {
          resolve({
            status: "ERR",
            message: "The user is not defined",
          });
        } else {
          const comparePass = await bcrypt.compareSync(userLogin.password, checkPerson.password);
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
  }

  delete(id: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.execute("call delete_user(?)", [id]);
        resolve({
          status: "OK",
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
