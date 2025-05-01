const formatType = [
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY/MM/DD",
  "DD-MM-YYYY",
  "MM-DD-YYYY",
  "YYYY-MM-DD",
];

export const dateTimeTransform = (
  dateString: string | undefined,
  format: string = "DD/MM/YYYY",
  isTime: boolean = true
): string => {
  if (!dateString) return "Invalid date";
  if (!formatType.includes(format)) return "Invalid format";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date format";

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hour = String(date.getUTCHours()).padStart(2, "0");
  const minute = String(date.getUTCMinutes()).padStart(2, "0");
  const time = `${hour}:${minute}`;

  let formattedDate = "";

  switch (format) {
    case "DD/MM/YYYY":
      formattedDate = `${day}/${month}/${year}`;
      break;
    case "MM/DD/YYYY":
      formattedDate = `${month}/${day}/${year}`;
      break;
    case "YYYY/MM/DD":
      formattedDate = `${year}/${month}/${day}`;
      break;
    case "DD-MM-YYYY":
      formattedDate = `${day}-${month}-${year}`;
      break;
    case "MM-DD-YYYY":
      formattedDate = `${month}-${day}-${year}`;
      break;
    case "YYYY-MM-DD":
      formattedDate = `${year}-${month}-${day}`;
      break;
    default:
      return "Invalid format";
  }

  return isTime ? `${time} | ${formattedDate}` : formattedDate;
};
