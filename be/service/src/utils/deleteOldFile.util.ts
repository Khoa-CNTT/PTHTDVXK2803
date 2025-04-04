import { v2 as cloudinary } from "cloudinary";

type DeleteOldFile = "image" | "video";

const deleteOldFile = async (publicId: string, typeFile: DeleteOldFile = "image") => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: typeFile });
  } catch (error) {
    console.error("Err delete old file", error);
  }
};

export default deleteOldFile;
