import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/icon.module.scss";
import {
  faBus,
  faHouse,
  faIdCard,
  faPercent,
  faPersonRunning,
  faRightFromBracket,
  faSuitcase,
  faThumbsUp,
  faTicket,
  faUser,
  faUsers,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

export type IconType =
  | "home"
  | "users"
  | "staff"
  | "driver"
  | "bus"
  | "suitcase"
  | "percent"
  | "ticket"
  | "thumbsUp"
  | "logout"
  | "running";

export const Icon = ({ type, isActive }: { type: IconType; isActive?: boolean }) => {
  const iconMap: Record<IconType, IconDefinition> = {
    home: faHouse,
    users: faUser,
    driver: faIdCard,
    staff: faUsers,
    bus: faBus,
    suitcase: faSuitcase,
    percent: faPercent,
    ticket: faTicket,
    thumbsUp: faThumbsUp,
    logout: faRightFromBracket,
    running: faPersonRunning,
  };

  return (
    <FontAwesomeIcon
      icon={iconMap[type]}
      className={`${styles.icon} ${isActive ? styles.active : null}`}
    />
  );
};
