import React from "react";
import styles from "../styles/logo.module.scss";
import LogoImage from "@/assets/icons/icon_vxr.jpg";
import { LogoProps } from "../types/props";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Logo: React.FC<LogoProps> = ({ image, icon }) => {
  if (image) {
    return <img className={styles.logo} src={LogoImage} />;
  }
  if (icon) {
    return (
      <div className={styles.logo}>
        <FontAwesomeIcon className={styles.img} icon={icon} style={{ color: "#ffffff" }} />
        <h1 className={styles.name}>Sylph Bus</h1>
      </div>
    );
  }
};

export default Logo;
