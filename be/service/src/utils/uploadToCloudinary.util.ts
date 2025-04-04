import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

type TypeFile = "image" | "video";

// export const uploadToCloudinary = async (
//   fileBuffer: Buffer,
//   folder: string,
//   typeFile: TypeFile = "image"
// ) => {
//   return new Promise<{ public_id: string; url: string }>((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream({ resource_type: typeFile }, (err, result) => {
//       if (err) reject(err);
//       else resolve({ public_id: result!.public_id, url: result!.url });
//     });
//     streamifier.createReadStream(fileBuffer).pipe(stream);
//   });
// };

export const uploadToCloudinary = async (
  file: Buffer,
  folder: string,
  allowedFormats: string[],
  typeFile: TypeFile = "image"
) => {
  return new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: folder, allowed_formats: allowedFormats, resource_type: typeFile },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    streamifier.createReadStream(file).pipe(stream);
  });
};
