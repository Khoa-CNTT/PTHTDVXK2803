const getDaysInMonthUtil = (month: number, year: number): string[] => {
  const days: string[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  console.log("daysInMonth", daysInMonth);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day + 1);
    days.push(date.toISOString().split("T")[0]);
  }

  return days;
};

export default getDaysInMonthUtil;
