import axios from "axios";
import { toast } from "react-toastify";

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export const bookTicketAPI = axios.create({
  baseURL: `https://${import.meta.env.VITE_API_URL}.ngrok-free.app/api`,
  withCredentials: true, // Gửi kèm cookie
  headers: { "ngrok-skip-browser-warning": "true" },
});

// Request Interceptor
bookTicketAPI.interceptors.request.use((config) => {
  return config; // Không cần thêm Authorization nữa
});

// Response Interceptor
bookTicketAPI.interceptors.response.use(
  (response) => response.data || [],
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => bookTicketAPI(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi refresh token - BE sẽ đặt lại access_token vào HttpOnly cookie
        await bookTicketAPI.get("/user/auth/refresh-token");

        processQueue(null);
        isRefreshing = false;

        return bookTicketAPI(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;

        toast.warning("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
