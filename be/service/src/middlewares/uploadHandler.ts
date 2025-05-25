import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.util";
import { uploadImages, uploadVideo } from "./multerConfig";
import deleteOldFile from "../utils/deleteOldFile.util";
import { getCloudinaryFolder } from "../utils/getCloudinaryFolder.util";
import { validateFile } from "../utils/validateFile.util";
import { UploadApiResponse } from "cloudinary";
import { CloudinaryAsset } from "../@types/cloudinary";

export interface RequestFile extends Request {
  uploadedImage: CloudinaryAsset;
}

interface RequestWithFile extends Request {
  file?: Express.Multer.File & { cloudinaryFile?: CloudinaryAsset };
}

export interface UploadedFile extends Express.Multer.File {
  cloudinaryImages?: CloudinaryAsset;
}

export interface RequestWithProcessedFiles extends Request {
  processedFiles: CloudinaryAsset[];
  processedFile: CloudinaryAsset;
}

const uploadVideoToCloudinary = async (req: RequestWithFile, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let bodyData;
    try {
      bodyData = JSON.parse(req.body?.data || "{}");
    } catch (error) {
      return res.status(400).json({ message: "Invalid JSON data format" });
    }

    const { id, public_video_id } = bodyData;
    if (!id) return res.status(400).json({ message: "Missing Trip id" });

    const folder = `booking-ticket/bus/trip/${id}`;

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      folder,
      ["mp4", "avi", "mov", "mkv"],
      "video"
    );

    // Delete old video if exists
    if (public_video_id) {
      await deleteOldFile(public_video_id, "video");
    }

    // Assign data to req
    req.file.cloudinaryFile = {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
    };

    next();
  } catch (error) {
    console.error("Upload video error:", error);
    res.status(500).json({ message: "Error uploading video to Cloudinary" });
  }
};

const uploadImagesToCloudinary = async (
  req: RequestWithProcessedFiles,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const files = req.files as Express.Multer.File[];
    const data = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body.data;
    const indexIsMain = Number(data?.indexIsMain ?? -1);
    const folder = "book-bus-ticket/images/car";
    const allowedFormats = ["png", "jpg", "jpeg"];

    // Upload all images in parallel
    const uploadImages = await Promise.all(
      files.map(async (file, index) => {
        if (!validateFile(file.originalname, "image")) {
          throw new Error(
            `Invalid file format: ${file.originalname}. Only jpg, png, jpeg are allowed.`
          );
        }

        const result = await uploadToCloudinary(file.buffer, folder, allowedFormats, "image");

        return {
          secure_url: result.secure_url,
          public_id: result.public_id,
          asset_id: result.asset_id,
          originIndex: index,
        };
      })
    );

    req.processedFiles = uploadImages.map((image) => ({
      ...image,
      isMain: image.originIndex === indexIsMain ? 1 : 0,
    })) as CloudinaryAsset[];

    return next();
  } catch (error) {
    console.error("Upload Images error:", error);
    res.status(500).json({ message: "Error uploading images to Cloudinary" });
  }
};

const uploadImageToCloudinary = async (req: RequestFile, res: Response, next: NextFunction) => {
  try {
    
    if (!req.file) {
      return next();
    }
    let file = req.file as Express.Multer.File;

    const folder = "book-bus-ticket/images/avatar";

    const allowedFormats = ["png", "jpg", "jpeg"];

    // Upload image
    if (!validateFile(file.originalname, "image")) {
      throw new Error(
        `Invalid file format: ${file.originalname}, Only jpg, png, jpeg are allowed.`
      );
    }
    const result: UploadApiResponse = await uploadToCloudinary(
      file.buffer,
      folder,
      allowedFormats,
      "image"
    );
    
    req.uploadedImage = result;

    next();
  } catch (error) {
    console.error("Upload Images error:", error);
    res.status(500).json({ message: "Error uploading images to Cloudinary" });
  }
};

export {
  uploadImages,
  uploadImageToCloudinary,
  uploadImagesToCloudinary,
  uploadVideo,
  uploadVideoToCloudinary,
};
