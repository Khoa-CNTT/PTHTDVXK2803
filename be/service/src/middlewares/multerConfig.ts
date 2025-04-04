import multer from "multer";
import { validateFile } from "../utils/validateFile.util";

const storage = multer.memoryStorage();

export const uploadImage = multer({ storage }).single("file");

export const uploadImages = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }).array(
  "files",
  5
);

export const uploadVideo = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Giới hạn 50MB
  fileFilter(req, file, callback) {
    // const allowFormats = ["mp4", "avi", "mov", "mkv"];

    if (validateFile(file.originalname, "video")) {
      return callback(new Error("Invalid file format, only (mp4, avi, mov, mkv) allow"));
    }

    // Nếu file hợp lệ, cho phép upload
    callback(null, true);
  },
}).single("video");
