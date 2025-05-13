import { Dispatch, SetStateAction } from "react";

export type ThemeContextType = {
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
};
