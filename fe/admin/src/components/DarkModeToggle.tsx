// DarkModeToggle.tsx
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import useThemeStore from "../store/useThemeStore";

interface DarkModeToggleProps {
  fullWidth?: boolean;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ fullWidth = false }) => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      className={`btn ${theme === "dark" ? "btn-light" : "btn-dark"} ${fullWidth ? "w-100" : ""}`}
      onClick={toggleTheme}
    >
      {theme === "light" ? <FaMoon /> : <FaSun />} {theme === "light" ? "Dark Mode" : "Light Mode"}
    </button>
  );
};

export default DarkModeToggle;
