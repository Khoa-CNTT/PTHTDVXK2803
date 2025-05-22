export const getLastDateOfMonth = (dateStart: string) => {
  const currentDate = new Date(dateStart);
  return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
};

export const getEndOfMonthOfString = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  const lastDay = new Date(year, month + 1, 0);
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay.getDate()).padStart(
    2,
    "0"
  )} 23:59:59`;
};
