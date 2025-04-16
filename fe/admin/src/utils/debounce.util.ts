//  Định nghĩa kiểu hàm nhận bất kỳ tham số nào và không trả về gì
type DebounceFunction<T extends unknown[]> = (...args: T) => void;

export const debounce = <T extends unknown[]>(
  func: DebounceFunction<T>,
  delay: number
): DebounceFunction<T> => {
  let timer: number;
  return (...arg: T) => {
    // Hủy bỏ timer nếu có
    clearTimeout(timer);

    // Đặt lại timer mới
    timer = window.setTimeout(() => {
      func(...arg); //  Gọi hàm func sau khi hết thời gian delay
    }, delay);
  };
};
