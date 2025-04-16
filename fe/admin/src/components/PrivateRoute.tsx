import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute: React.FC = () => {
  const location = useLocation();
  const status = localStorage.getItem("accept"); // Lấy trạng thái từ localStorage

  return status ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} /> // Redirect tới login và giữ lại vị trí ban đầu
  );
};

export default PrivateRoute;
