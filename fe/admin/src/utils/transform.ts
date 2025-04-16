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
) => {
  if (!dateString) return "Invalid date";
  if (!formatType.includes(format)) return "Invalid format";

  const [datePart, timePart] = dateString.trim().split(" ");
  const dateParts = datePart.split("-");

  if (dateParts.length !== 3) return "Invalid date format";

  const [year, month, day] = dateParts;
  const time = timePart || "";

  switch (format) {
    case "DD/MM/YYYY":
      return `${isTime === false ? "" : `${time} | `}${day}/${month}/${year} `;
    case "MM/DD/YYYY":
      return `${isTime === false ? "" : `${time} | `}${month}/${day}/${year} `;
    case "YYYY/MM/DD":
      return `${isTime === false ? "" : `${time} | `}${year}/${month}/${day} `;
    case "DD-MM-YYYY":
      return `${isTime === false ? "" : `${time} | `}${day}-${month}-${year} `;
    case "MM-DD-YYYY":
      return `${isTime === false ? "" : `${time} | `}${month}-${day}-${year} `;
    case "YYYY-MM-DD":
      return `${isTime === false ? "" : `${time} | `}${year}-${month}-${day} `;
    default:
      return "Invalid format";
  }
};
