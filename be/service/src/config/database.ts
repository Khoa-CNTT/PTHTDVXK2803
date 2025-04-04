import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Lấy từ biến môi trường
  ssl: {
    rejectUnauthorized: false, // Render yêu cầu SSL
  },
});

// Kiểm tra kết nối
pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL on Render"))
  .catch((err) => console.error("Connection error", err));

export default pool;
