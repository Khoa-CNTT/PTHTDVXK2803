import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const bookBusTicketsDB = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.BOOK_BUS_TICKETS_DB,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0,
  timezone: "+07:00",
});

export { bookBusTicketsDB };
