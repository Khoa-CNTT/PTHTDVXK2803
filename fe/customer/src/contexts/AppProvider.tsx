import ThemeProvider from "./ThemeProvider";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export default AppProvider;
