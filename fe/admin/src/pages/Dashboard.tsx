import styles from "../styles/dashboard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faTicket, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../services/statistical.service";
import RevenueChartByHours from "../components/RevenueChartByHours";
import RevenueChartByMonth from "../components/RevenueChartByMonth";
import RevenueChartByYear from "../components/RevenueChartByYear";

const Dashboard = () => {
  const { data: statsData } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getDashboardStats(),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return (
    <div className={styles["dashboard"]}>
      <div className={styles["dashboard-summary"]}>
        <div className={styles["dashboard-summary__item"]}>
          <div className={styles["dashboard-summary__item-title"]}>
            <p>Người dùng</p>
          </div>
          <div className={styles["dashboard-summary__item-info"]}>
            <FontAwesomeIcon icon={faUser} />
            <h6>{statsData?.totalCustomers}</h6>
          </div>
        </div>
        <div className={styles["dashboard-summary__item"]}>
          <div className={styles["dashboard-summary__item-title"]}>
            <p>Nhân viên</p>
          </div>
          <div className={styles["dashboard-summary__item-info-wrapper"]}>
            <div className={styles["info"]}>
              <FontAwesomeIcon icon={faUsers} />
              <h6>{statsData?.totalStaffs}</h6>
            </div>
            <div className={styles["info"]}>
              <div className={styles["content"]}>
                <p className={styles.title}>Tài xế </p>
                <p>{statsData?.totalDrivers}</p>
              </div>
              <div className={styles["content"]}>
                <p className={styles.title}>Phụ xe </p>
                <p>{statsData?.totalCoDrivers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles["dashboard-summary__item"]}>
          <div className={styles["dashboard-summary__item-title"]}>
            <p>Xe khách</p>
          </div>
          <div className={styles["dashboard-summary__item-info"]}>
            <FontAwesomeIcon icon={faBus} />
            <h6>{statsData?.totalCars}</h6>
          </div>
        </div>

        <div className={styles["dashboard-summary__item"]}>
          <div className={styles["dashboard-summary__item-title"]}>
            <p>Vé xe</p>
          </div>
          <div className={styles["dashboard-summary__item-info"]}>
            <FontAwesomeIcon icon={faTicket} />
            <h6>{statsData?.totalTickets}</h6>
          </div>
        </div>
      </div>
      <div className={styles["revenue-chart"]}>
        <RevenueChartByHours />
        <RevenueChartByMonth />
        <RevenueChartByYear />
      </div>
    </div>
  );
};

export default Dashboard;
