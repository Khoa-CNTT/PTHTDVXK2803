import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.routes";
import { createServer } from "http";

dotenv.config();
const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: ["http://localhost:5173"],
    // origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use(express.json({ limit: "50mb" }));

// Xử lý request body với dữ liệu form
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (_, res) => {
  res.send("Server running ...");
});

routes(app);

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => console.log(`Server chạy trên cổng ${PORT}`));
