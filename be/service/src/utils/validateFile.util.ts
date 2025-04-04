type TypeFile = "image" | "video";
const allowImageFormat = ["jpg", "png", "jpeg"];
const allowVideoFormats = ["mp4", "avi", "mov", "mkv"];

export const validateFile = (filename: string, typeFile: TypeFile = "image"): boolean => {
  const parts = filename.split(".");

  if (parts.length < 2) return false;

  const fileExtension = filename.split(".").pop()?.toLowerCase();

  if (typeFile === "image") return !!fileExtension && allowImageFormat.includes(fileExtension);
  else return !!fileExtension && allowVideoFormats.includes(fileExtension);
};
