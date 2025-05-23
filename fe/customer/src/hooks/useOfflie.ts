import { useEffect } from "react";
import { logout } from "../services/auth.service";
import { toast } from "react-toastify";
import { setUser } from "../store/actions/userActions";

const useOffline = () => {
  useEffect(() => {
    window.addEventListener("offline", handleOffline);

    return () => window.removeEventListener("offline", handleOffline);
  });

  const handleOffline = async () => {
    const response = await logout();
    if (response.status === "OK") {
      toast.success("Đăng xuất thành công");
      setUser({ email: "", fullName: "" });
      localStorage.removeItem("accept");
      localStorage.removeItem("expirationTime");
      window.location.href = "/login";
    } else {
      toast.error("Đăng xuất thất bại");
    }
  };
};

export default useOffline;
