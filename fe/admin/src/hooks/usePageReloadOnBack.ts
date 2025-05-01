import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const usePageReloadOnBack = () => {
  const location = useLocation();

  useEffect(() => {
    // Lấy thông tin điều hướng của trang hiện tại
    const navigationEntries = performance.getEntriesByType("navigation");

    // Kiểm tra nếu người dùng quay lại trang này từ lịch sử
    if (navigationEntries.length > 0) {
      const navigationEntry = navigationEntries[0] as PerformanceNavigationTiming;

      // Kiểm tra kiểu điều hướng
      if (navigationEntry.entryType === "navigation" && navigationEntry.type === "back_forward") {
        window.location.reload(); // Reload trang
      }
    }
  }, [location]); // Khi location thay đổi, kiểm tra lại
};

export default usePageReloadOnBack;
