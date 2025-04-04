import jwt from "jsonwebtoken";

// Tạo Access Token
export const generalAccessToken = (payload: any): string => {
  const { id, role } = payload;
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN, { expiresIn: "30s" });
};

// Tạo Refresh Token
export const generalRefreshToken = (payload: any): string => {
  const { id, role } = payload;
  return jwt.sign({ id, role }, process.env.REFRESH_TOKEN, { expiresIn: "1m" });
};

// Xác minh Refresh Token & cấp lại Access Token
export const verifyRefreshToken = (token: string): Promise<any> => {
  return new Promise((resolve) => {
    jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user: any) => {
      if (err) {
        return resolve({ status: "ERR", message: "The authentication failed" });
      }
      const access_token = generalAccessToken({ id: user.id, role: user.role });
      const refresh_token = generalRefreshToken({ id: user.id, role: user.role });

      resolve({
        status: "OK",
        message: "Get user success",
        access_token,
        refresh_token,
      });
    });
  });
};
