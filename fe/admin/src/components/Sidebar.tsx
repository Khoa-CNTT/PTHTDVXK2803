import { useState } from "react";
import { NavLink } from "react-router-dom";
import useThemeStore from "../store/useThemeStore"; // store zustand của bạn
import { FaHome, FaClock, FaHeart, FaBars } from "react-icons/fa";
import { MdSubscriptions, MdPlaylistPlay } from "react-icons/md";
import { BsPlayCircle } from "react-icons/bs";
import styles from "../styles/Sidebar.module.scss";

const Sidebar = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`${styles.Sidebar} ${collapsed ? styles.collapsed : ""} ${
        theme ? styles.dark : ""
      }`}
    >
      <div className={styles.topSection}>
        <button className={styles.toggleBtn} onClick={toggleSidebar}>
          <FaBars />
        </button>
        {!collapsed && <span className={styles.logo}>YouTube</span>}
      </div>

      <nav className={styles.menu}>
        <ul>
          <li>
            <NavLink to="/">
              <FaHome /> {!collapsed && "Trang chủ"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/shorts">
              <BsPlayCircle /> {!collapsed && "Shorts"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/subscriptions">
              <MdSubscriptions /> {!collapsed && "Kênh đăng ký"}
            </NavLink>
          </li>
        </ul>

        <hr />

        <div className={styles.sectionTitle}>{!collapsed && "Bạn"}</div>
        <ul>
          <li>
            <NavLink to="/history">
              <FaClock /> {!collapsed && "Video đã xem"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/playlists">
              <MdPlaylistPlay /> {!collapsed && "Danh sách phát"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/watch-later">
              <FaClock /> {!collapsed && "Xem sau"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/liked">
              <FaHeart /> {!collapsed && "Video đã thích"}
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className={styles.bottomSection}>
        <button onClick={toggleTheme} className="btn btn-dark w-100">
          {theme ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
