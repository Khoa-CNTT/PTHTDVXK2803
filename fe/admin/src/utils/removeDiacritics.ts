export const removeDiacritics = (value: string) => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
    .replace(/đ/g, "d") // Thay thế "đ" → "d"
    .replace(/Đ/g, "D"); // Thay thế "Đ" → "D";
};
