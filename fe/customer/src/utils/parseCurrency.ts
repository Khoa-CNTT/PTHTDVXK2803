export const parseCurrency = (formatted: string): number => {
  const onlyDigits = formatted.replace(/[^\d]/g, ""); // Xoá mọi ký tự không phải số
  return Number(onlyDigits);
};
