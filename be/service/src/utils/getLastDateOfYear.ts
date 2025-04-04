export const getLastDateOfYear = (dateStart: string) => {
  const currentDate = new Date(dateStart);
  return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
};
