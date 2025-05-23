import { useEffect } from "react";
import { debounce } from "./debounce";

const useClientWidth = () => {
  useEffect(() => {
    const debounceCliWidth = debounce(updateClientWidth, 200);
    updateClientWidth();
    // Chỉ đăng ký sự kiện resize, không gọi updateClientWidth ngay
    const handleResize = () => {
      debounceCliWidth(); // Gọi updateClientWidth khi có sự kiện resize
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
};

const updateClientWidth = () => {
  const clientWidth = document.documentElement.clientWidth;
  document.documentElement.style.setProperty("--client-width", `${clientWidth}px`);
};
export default useClientWidth;
