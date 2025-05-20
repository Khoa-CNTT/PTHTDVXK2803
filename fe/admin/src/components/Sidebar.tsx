import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled from "../styles/sidebar.module.scss";
// import { toast } from "react-toastify";
// import { logout } from "../services/auth.service";
import { Icon, IconType } from "./Icon";

interface SideBarProps {
  statusSideBar?: boolean;
}

const Sidebar: React.FC<SideBarProps> = ({ statusSideBar }) => {
  // const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(statusSideBar);

  useEffect(() => {
    setCollapsed(statusSideBar);
  }, [statusSideBar]);

  if (location.pathname === "/login") return null;

  // const handleLogout = async () => {
  //   const response = await logout();
  //   if (response.status === "OK") {
  //     toast.success("Đăng xuất thành công");
  //     localStorage.removeItem("accept");
  //     localStorage.removeItem("expirationTime");
  //     navigate("/login");
  //   } else {
  //     toast.error("Đăng xuất thất bại");
  //   }
  // };

  return (
    <div className={`${collapsed ? styled["collapsed"] : styled["side-bar"]}`}>
      <nav className={styled["side-bar__menu"]}>
        <ul className={styled.list}>
          {[
            { to: "/", label: "Tổng quan", icon: "home" },
            { to: "/customer-manage", label: "Quản lý Khách hàng", icon: "users" },
            { to: "/admin-manage", label: "Quản lý Nhân viên", icon: "staff" },
            { to: "/driver-manage", label: "Quản lý Tài xế", icon: "driver" },
            { to: "/bus-manage", label: "Quản lý Xe", icon: "bus" },
            { to: "/trip-manage", label: "Quản lý Chuyến xe", icon: "suitcase" },
            { to: "/promotion-manage", label: "Quản lý Khuyến mãi", icon: "percent" },
            { to: "/ticket-manage", label: "Quản lý Vé xe", icon: "ticket" },
            { to: "/feedback-manage", label: "Quản lý Đánh giá", icon: "thumbsUp" },
          ].map(({ to, label, icon }) => (
            <li key={to} className={styled["side-bar__menu-item"]}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `${styled["side-bar__menu-link"]} ${isActive ? styled["active"] : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon type={icon as IconType} isActive={isActive} />
                    <span className={styled["side-bar__section-title"]}>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
          {/* <li className={`${styled["side-bar__menu-item"]} ${styled["ic-wrapper"]}`}>
            <div onClick={handleLogout} className={styled["side-bar__logout"]}>
              <Icon type="logout" />
              <Icon type="running" />
            </div>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
