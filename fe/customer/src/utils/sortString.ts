const sortString = (arr: string[]) => {
  return arr.sort((a, b) => a.localeCompare(b));
};

export default sortString;
