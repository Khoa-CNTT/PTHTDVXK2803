import { useEffect, useRef, useState } from "react";
import styled from "../styles/header.module.scss";
import { FaBars, FaBus, FaHome, FaTicketAlt, FaUsers, FaUserTie } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { RiAdminFill, RiUserStarFill } from "react-icons/ri";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const sideBarRef = useRef<HTMLDivElement>(null);

  const handleToggleSideBar = () => {
    setCollapsed(!collapsed);
  };

  const handleClickOutSide = (e: MouseEvent) => {
    e.stopPropagation();
    if (!collapsed && sideBarRef.current && !sideBarRef.current.contains(e.target as Node)) {
      setCollapsed(true);
    }
  };

  useEffect(() => {
    if (!collapsed) {
      document.addEventListener("mousedown", handleClickOutSide);
      return () => document.removeEventListener("mousedown", handleClickOutSide);
    }
  }, [collapsed]);

  return (
    <div className={styled["container-header"]}>
      <div className={styled.actions}>
        <div className="">YudLinBus</div>
        <div className={styled["action__show-side-bar"]}>
          <FaBars
            onMouseDown={(e) => {
              e.stopPropagation();
              handleToggleSideBar();
            }}
          />
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
          <span className={styled["side-bar-mobile__logo"]}>YudLinhBus</span>
        </div>

        <nav className={styled["side-bar-mobile__menu"]}>
          <ul className={styled.list}>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <FaHome className={styled.icon} />
                <span className={styled["side-bar-mobile__section-title"]}>Trang chủ</span>
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
                <span className={styled["side-bar-mobile__section-title"]}>
                  Quản lý quản trị viên
                </span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/driver-manage" className={styled["side-bar-mobile__menu-link"]}>
                <FaUserTie className={styled.icon} />
                <span className={styled["side-bar-mobile__section-title"]}>Quản lý tài xế</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/co-driver-manage" className={styled["side-bar-mobile__menu-link"]}>
                <RiUserStarFill className={styled.icon} />
                <span className={styled["side-bar-mobile__section-title"]}>Quản lý phụ xe</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/bus-manage" className={styled["side-bar-mobile__menu-link"]}>
                <FaBus className={styled.icon} />
                <span className={styled["side-bar-mobile__section-title"]}>Quản lý xe khách</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/trip-manage" className={styled["side-bar-mobile__menu-link"]}>
                <FaBus className={styled.icon} />
                <span className={styled["side-bar-mobile__section-title"]}>Quản lý chuyến đi</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/promotion-manage" className={styled["side-bar-mobile__menu-link"]}>
                <FaTicketAlt className={styled.icon} />
                <span className={styled["side-bar-mobile__section-title"]}>Quản khuyến mãi</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/ticket-manage" className={styled["side-bar-mobile__menu-link"]}>
                <FaTicketAlt className={styled.icon} />
                <span className={styled["side-bar-mobile__section-title"]}>Quản lý vé</span>
              </NavLink>
            </li>
            <li className={`${styled["side-bar-mobile__menu-item"]} ${styled["action-logout"]}`}>
              <FontAwesomeIcon icon={faRightFromBracket} className={styled["ic-default"]} />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
