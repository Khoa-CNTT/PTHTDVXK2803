import { Outlet } from "react-router";
import styles from "../styles/manageLayout.module.scss";
const ManageLayout = () => {
  return (
    <div className={styles["manage-layout"]}>
      {/* <h2>Hệ thống Quản lý xe</h2> */}
      <Outlet />
    </div>
  );
};

export default ManageLayout;
