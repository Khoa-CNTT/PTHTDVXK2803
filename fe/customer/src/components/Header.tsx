import { useEffect, useRef, useState } from "react";
import styled from "../styles/header.module.scss";
import { FaBars } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FaRegUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { logout } from "../services/auth.service";
import logo3 from "../assets/images/logo4.jpg";
import { useUserStore } from "../store/userStore";
import { useLocation } from "react-router";

const Header = () => {
 const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  const sideBarRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [labguageIcon, setLanguageIcon] = useState<boolean>(true);
  const [btnLogin, setBtnLogin] = useState<boolean>(true);
  const [btnRegister, setBtnRegister] = useState<boolean>(false);
  const location = useLocation();

  
  const handleToggleSideBar = () => {
    setCollapsed(!collapsed);
  };

  const handleToggleLanguage = () => {
    setLanguageIcon(!labguageIcon);
  };

  const handleClickOutSide = (e: MouseEvent) => {
    e.stopPropagation();
    if (!collapsed && sideBarRef.current && !sideBarRef.current.contains(e.target as Node)) {
      setCollapsed(true);
    }
  };

  const handleLogout = async () => {
    const response = await logout();
    if (response.status === "OK") {
      toast.success("Đăng xuất thành công");
      setUser({email: "", fullName: ""})
      localStorage.removeItem("accept");
      localStorage.removeItem("expirationTime");
      navigate("/");
    } else {
      toast.error("Đăng xuất thất bại");
    }
  };

  useEffect(() => {
    if (!collapsed) {
      document.addEventListener("mousedown", handleClickOutSide);
      return () => document.removeEventListener("mousedown", handleClickOutSide);
    }
  }, [collapsed]);

  const onClickLogin = () => {
    setBtnLogin(true)
    setBtnRegister(false)
        navigate("/login")

  }

  const onClickRegister = () => {
    setBtnLogin(false)
    setBtnRegister(true)
        navigate("/register")
        
  }
  
  const handleUpdateInformation = () => {
    navigate("/profile")
  }

  const handleUpdatePassword = () => {
    navigate("/update-password")
  }
  
  const handleHistoryBookTicket = () => {
    navigate("/lich-su-dat-ve")

  }

  const handleClickLogo = () => {
    navigate("/")

  }
  return (
    <div className={`${styled["container-header"]} ${location.pathname === "/" ? styled["header-homepage"] : styled["header-children"]}`}>
      <div className={styled["top-header"]}>
        <div className={styled.actions}>
          <div className={styled["action__show-side-bar"]}>
            <FaBars
              onMouseDown={(e) => {
                e.stopPropagation();
                handleToggleSideBar();
              }}
              className={styled["action__show-side-bar__icon"]}
            />
          </div>
          <div className={styled.logoContainer}>
          <img src={logo3} alt="logo" className={styled["logo-banner__img"]} onClick={handleClickLogo}/>
              
              <div className={styled.languages}>
            <img
              src={
                labguageIcon === true
                  ? "https://futabus.vn/images/icons/vietnam.svg"
                  : "https://futabus.vn/images/icons/eng.svg"
              }
              alt={"language-icon"}
              onClick={handleToggleLanguage}
            />
          </div>
          </div>
          
        </div>

        <div className={styled["login-register"]}>
          {user && user?.email
          ? 
          <div className={styled.name}>
            <div className={styled.key}>
              <FaRegUserCircle />
              <span>
              {user?.fullName ? user?.fullName : user?.email}
            </span>
            </div>
            <div className={styled.information}>
          <ul>
            <li onClick={handleUpdateInformation}>Cập nhật thông tin</li>
            <li onClick={handleHistoryBookTicket}>Lịch sử đặt vé</li>
            <li onClick={handleUpdatePassword}>Đặt lại mật khẩu</li>
            <li onClick={handleLogout}>Đăng xuất</li>
          </ul>
        </div>
          </div>
          :
          // <NavLink to="/login" className={styled["login-register__link"]}>
          <div className={styled["login-register__link"]}>
            <span className={`${styled["login-text"]} ${btnLogin ? styled.active :  styled.hide}`} onClick={onClickLogin}>Đăng nhập</span>
            <span className={`${styled["register-text"]} ${btnRegister ? styled.active :  styled.hide}`} onClick={onClickRegister}>Đăng ký</span>
            <FontAwesomeIcon icon={faUser} className={styled["login-register__link-ic"]} />
          </div>
          // </NavLink>
          }
          
        </div>
        
      </div>
      <div className={styled["bottom-header"]}>
        <div className={styled["bottom-header__menu"]}>
          <ul className={styled.list}>
            <li className={styled["bottom-header__menu-item"]}>
              <NavLink to="/" className={styled["bottom-header__menu-link"]}>
                <span className={styled["bottom-header__section-title"]}>Trang chủ</span>
              </NavLink>
            </li>
            <li className={styled["bottom-header__menu-item"]}>
              <NavLink to="/schedule" className={styled["bottom-header__menu-link"]}>
                <span className={styled["bottom-header__section-title"]}>Lịch trình</span>
              </NavLink>
            </li>
            <li className={styled["bottom-header__menu-item"]}>
              <NavLink to="/lookup" className={styled["bottom-header__menu-link"]}>
                <span className={styled["bottom-header__section-title"]}>Tra cứu vé</span>
              </NavLink>
            </li>
            <li className={styled["bottom-header__menu-item"]}>
              <NavLink to="/rental-car" className={styled["bottom-header__menu-link"]}>
                <span className={styled["bottom-header__section-title"]}>Thuê xe</span>
              </NavLink>
            </li>
            <li className={styled["bottom-header__menu-item"]}>
              <NavLink to="/news" className={styled["bottom-header__menu-link"]}>
                <span className={styled["bottom-header__section-title"]}>Tin tức</span>
              </NavLink>
            </li>
            <li className={styled["bottom-header__menu-item"]}>
              <NavLink to="/about-us" className={styled["bottom-header__menu-link"]}>
                <span className={styled["bottom-header__section-title"]}>Về chúng tôi</span>
              </NavLink>
            </li>
          </ul>
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
                <span className={styled["side-bar-mobile__section-title"]}>Trang chủ</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <span className={styled["side-bar-mobile__section-title"]}>Lịch trình</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <span className={styled["side-bar-mobile__section-title"]}>Tra cứu vé</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <span className={styled["side-bar-mobile__section-title"]}>Tin tức</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <span className={styled["side-bar-mobile__section-title"]}>Hóa đơn</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <span className={styled["side-bar-mobile__section-title"]}>Liên hệ</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <span className={styled["side-bar-mobile__section-title"]}>Về chúng tôi</span>
              </NavLink>
            </li>
            <li className={styled["side-bar-mobile__menu-item"]}>
              <NavLink to="/" className={styled["side-bar-mobile__menu-link"]}>
                <span className={styled["side-bar-mobile__section-title"]}>Tuyển dụng</span>
              </NavLink>
            </li>
            <li className={`${styled["side-bar-mobile__menu-item"]} ${styled["action-logout"]}`}>
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className={styled["ic-default"]}
                // onClick={handleLogout}
              />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
