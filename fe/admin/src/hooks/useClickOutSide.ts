// hooks/useClickOutSide.ts
import { useEffect } from "react";

const useClickOutside = (refs: React.RefObject<HTMLElement>[], callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Kiểm tra xem có click vào element nào trong danh sách refs không
      const isOutside = refs.every((ref) => {
        return ref.current && !ref.current.contains(event.target as Node);
      });

      // Nếu click bên ngoài tất cả các phần tử trong refs, thực hiện callback
      if (isOutside) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
};

export default useClickOutside;
