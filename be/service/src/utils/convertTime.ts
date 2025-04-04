import moment from "moment-timezone";

export const convertToVietnamTime = (date: string | Date | null) => {
  if (!date) return null;

  const utcDate = moment.utc(date); // Giữ nguyên giá trị gốc
  return utcDate.tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
};
