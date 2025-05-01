function sortStringO<T>(arr: T[], key?: keyof T): T[] {
  if (!arr || arr.length === 0) return [];

  return [...arr].sort((a, b) => {
    const aValue = key ? String(a[key]) : String(a);
    const bValue = key ? String(b[key]) : String(b);
    return aValue.localeCompare(bValue, "vi", { sensitivity: "base" });
  });
}

export default sortStringO;
