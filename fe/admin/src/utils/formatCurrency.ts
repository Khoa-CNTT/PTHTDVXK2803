const formatCurrency = (value: number | string): string => {
  const number = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(number)) return "Invalid number";

  return `${number.toLocaleString("vi-VN")} VNĐ`;
};

export default formatCurrency;
