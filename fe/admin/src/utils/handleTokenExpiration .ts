import { bookTicketAPI } from "../services/customize.service";

function refreshAccessToken() {
  console.log("refresh-access-token");
  bookTicketAPI.get(`/user/auth/refresh-token`, { withCredentials: true });
}

export function handleTokenExpiration() {
  const status = localStorage.getItem("status");
  const expirationStr = localStorage.getItem("expirationTime");

  if (status !== "OK" || !expirationStr) return;

  const expiration = parseInt(expirationStr, 10);
  const timeToExpire = expiration - Date.now();
  console.log("timeToExpire", timeToExpire);

  if (timeToExpire < 0) {
    // Đã hết hạn, gọi refresh ngay
    refreshAccessToken();
  } else {
    // Còn thời gian, setup gọi tự động trước khi hết hạn
    setTimeout(() => {
      refreshAccessToken();
    }, timeToExpire);
  }
}
