import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import routes from "./routes/routes.routes";
import { config } from "./config/config";
import { createServer } from "http";
import session from "express-session";
import passport from "passport";
import { connectRedis } from "./config/redis";
import { initSocket } from "./sockets/socket";

dotenv.config();

const app = express();
const server = createServer(app);

// Middleware cấu hình CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.URL_LOCALHOST,
      process.env.URL_FRONTEND_CLIENT,
      process.env.URL_FRONTEND_ADMIN,
    ],
    // origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Cấu hình session
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware Passport
app.use(passport.initialize());
app.use(passport.session());

// Xử lý request body với dữ liệu JSON
app.use(express.json({ limit: "50mb" }));

// Xử lý request body với dữ liệu form
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Xử lý cookies
app.use(cookieParser());

// Khởi động Websocket
initSocket(server);

// Test route
app.get("/", (_, res) => {
  res.send("Server running ...");
});

// Gọi routes
routes(app);

// Start server
async function startServer() {
  try {
    await connectRedis();
    console.log("Redis connected successfully");

    const port = config.PORT || 3004;
    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect Redis", error);
    process.exit(1); // dừng server nếu Redis không kết nối được
  }
}

startServer();
