import { useEffect, useRef, useState } from "react";
import styled from "../styles/header.module.scss";
import { FaBars, FaBus, FaHome, FaTicketAlt, FaUsers, FaUserTie } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { RiAdminFill, RiUserStarFill } from "react-icons/ri";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { logout } from "../services/auth.service";
import { toast } from "react-toastify";
import logo from "../assets/images/logo.png";
import { useLocation } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const sideBarRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const handleToggleSideBar = () => {
    setCollapsed(!collapsed);
  };

  const handleClickOutSide = (e: MouseEvent) => {
    e.stopPropagation();
    if (!collapsed && sideBarRef.current && !sideBarRef.current.contains(e.target as Node)) {
      setCollapsed(true);
    }
  };

  const handleClickOutSideDropList = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setShowDropDown(false);
    }
  };

  const handleLogout = async () => {
    const response = await logout();
    if (response.status === "OK") {
      toast.success("Đăng xuất thành công");
      localStorage.removeItem("accept");
      localStorage.removeItem("expirationTime");
      navigate("/login");
    } else {
      toast.error("Đăng xuất thất bại");
    }
  };

  useEffect(() => {
    if (showDropDown) {
      document.addEventListener("mousedown", handleClickOutSideDropList);
      return () => document.removeEventListener("mousedown", handleClickOutSideDropList);
    }
  }, [showDropDown]);

  useEffect(() => {
    if (!collapsed) {
      document.addEventListener("mousedown", handleClickOutSide);
      return () => document.removeEventListener("mousedown", handleClickOutSide);
    }
  }, [collapsed]);

  return (
    <div className={`${styled["container-header"]} ${location.pathname === "/login" ? styled["note"]  : ""} `}>
      <div className={styled.actions}>
        <div className={styled["action__show-side-bar"]}>
          <FaBars
            className={styled.ic}
            onMouseDown={(e) => {
              e.stopPropagation();
              handleToggleSideBar();
            }}
          />
          <img className={styled.logo} src={logo} alt="logo" loading="lazy" />
        </div>
        <div
          className={styled["info-admin"]}
          onMouseEnter={() => setShowDropDown(true)}
          onClick={() => setShowDropDown((prev) => !prev)}
        >
          <FontAwesomeIcon className={styled["ic-admin"]} icon={faUserCircle} />
          {showDropDown ? (
            <div
              ref={wrapperRef}
              className={`${styled["wrapper-drop-down-list"]} ${styled["user-actions"]}`}
            >
              <ul className={styled["user-actions__list"]}>
                <li className={styled["item"]}>
                  <NavLink className={styled.text} to={`/profile`}>
                    Cập nhật thông tin
                  </NavLink>
                </li>
                <li className={styled["item"]}>
                  <NavLink className={styled.text} to={`/settings`}>
                    Cài đặt
                  </NavLink>
                </li>
                <li className={styled["item"]} onClick={handleLogout}>
                  <span className={styled.text}>Đăng xuất</span>
                </li>
              </ul>
              <span className={styled.triangle}></span>
            </div>
          ) : null}
        </div>
      </div>
      {/*  */}
      {!collapsed && <div className={styled["overlay"]} />}
      {/*  */}
      <div
        ref={sideBarRef}
        className={`${collapsed ? styled["collapsed"] : styled["side-bar-mobile"]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styled["side-bar-mobile__top-section"]}>
          <button className={styled["side-bar-mobile__closed-btn"]} onClick={handleToggleSideBar}>
            X
          </button>
          <span className={styled["side-bar-mobile__logo"]}>VeXeTienIch</span>
        </div>

        <nav className={styled["side-bar-mobile__menu"]}>
          <ul className={styled.list}>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <FaHome className={styled.icon} />
                <span className={styled["side-bar-mobile__section-title"]}>Tổng quan</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/customer-manage" className={styled["side-bar-mobile__menu-link"]}>
                <FaUsers className={styled.icon} />
                <span className={styled["side-bar-mobile__section-title"]}>Quản lý Khách hàng</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/admin-manage" className={styled["side-bar-mobile__menu-link"]}>
                <RiAdminFill className={styled.icon} />
                <span className={styled["side-bar-mobile__section-title"]}>Quản lý Nhân viên</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/driver-manage" className={styled["side-bar-mobile__menu-link"]}>
                <FaUserTie className={styled.icon} />
                <span className={styled["side-bar-mobile__section-title"]}>Quản lý Tài xế</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/bus-manage" className={styled["side-bar-mobile__menu-link"]}>
                <FaBus className={styled.icon} />
                <span className={styled["side-bar-mobile__section-title"]}>Quản lý Xe</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/trip-manage" className={styled["side-bar-mobile__menu-link"]}>
                <FaBus className={styled.icon} />
                <span className={styled["side-bar-mobile__section-title"]}>Quản lý Chuyến xe</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/promotion-manage" className={styled["side-bar-mobile__menu-link"]}>
                <FaTicketAlt className={styled.icon} />
                <span className={styled["side-bar-mobile__section-title"]}>Quản ly Khuyến mãi</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/ticket-manage" className={styled["side-bar-mobile__menu-link"]}>
                <FaTicketAlt className={styled.icon} />
                <span className={styled["side-bar-mobile__section-title"]}>Quản lý Vé xe</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/feedback-manage" className={styled["side-bar-mobile__menu-link"]}>
                <RiUserStarFill className={styled.icon} />
                <span className={styled["side-bar-mobile__section-title"]}>Quản lý Đánh giá</span>
              </NavLink>
            </li>
            <li className={`${styled["side-bar-mobile__menu-item"]} ${styled["action-logout"]}`}>
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className={styled["ic-default"]}
                onClick={handleLogout}
              />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
