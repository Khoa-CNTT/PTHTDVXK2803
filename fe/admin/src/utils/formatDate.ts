export const formatDate = (
  dateString: string,
  format: string = "DD/MM/YYYY",
  day: boolean = false
) => {
  if (!dateString) {
    return "Invalid date";
  }
  const date = new Date(dateString);

  const getDay = date.toString().split(" ")[0];

  if (isNaN(date.getTime())) {
    return "Invalid date format";
  }

  // Tạo đối tượng Intl.DateTimeFormat với tùy chọn định dạng ngày
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const formatter = new Intl.DateTimeFormat("vi-VN", options);
  const formatterDate = formatter.format(date); //  Trả về ngày định dạng DD/MM/YYYY

  if (format === "YYYY-MM-DD") {
    const [day, month, year] = formatterDate.split("/");
    const result = `${year}-${month}-${day}`;
    if (day) return `${getDay} ${result}`;
    return result;
  }

  if (format.includes("HH:mm")) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const result = `${formatterDate} ${hours}:${minutes}`;

    if (day) return `${getDay} ${result}`;
    return result;
  }

  if (day) return `${getDay} ${formatterDate}`;

  return formatterDate;
};
