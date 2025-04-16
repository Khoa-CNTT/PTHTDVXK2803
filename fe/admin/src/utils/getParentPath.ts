export const getParentPath = (path: string, levelsUp: number = 1): string => {
  const segments = path.split("/").filter(Boolean);
  if (segments.length <= levelsUp) return "/";
  return `/${segments.slice(0, -levelsUp).join("/")}`;
};
