import { useNavigate } from "react-router";
import styles from "../styles/tripCardInChatBox.module.scss";
import { TripData } from "../types/trip";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";

const TripCardInChatBox = ({ trip }: { trip: TripData }) => {
  const navigate = useNavigate();
  const handleDetailTrip = () => {
    const getStartTime = formatDate(trip.startTime, "DD-MM-YYYY-HH:mm", false);
    const getEndTime = formatDate(trip.endTime, "DD-MM-YYYY-HH:mm", false);
    const getStartDay = getStartTime.split(" ")[0];
    const getStartHours = getStartTime.split(" ")[1];
    const getEndDay = getEndTime.split(" ")[0];
    const getEndHours = getEndTime.split(" ")[1];
    navigate(
      `/dat-ve?license_plate=${trip.licensePlate}&from=${trip.departureLocation}&to=${trip.arrivalLocation}&start_day=${getStartDay}&start_hours=${getStartHours}&end_day=${getEndDay}&end_hours=${getEndHours}`
    );
  };
  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.tripInfo}>
          <h4 className={styles.title}>{trip.tripName}</h4>

          <p className={styles.text}>
            <strong>Tuyến xe:</strong> {`${trip.departureLocation} -> ${trip.arrivalLocation}`}
          </p>

          <p className={styles.text}>
            <strong>Khởi hành:</strong> {formatDate(trip.startTime, "DD-MM-YYYY-HH:mm", false)}
          </p>

          <p className={styles.text}>
            <strong>Đến nơi:</strong> {formatDate(trip.endTime, "DD-MM-YYYY-HH:mm", false)}
          </p>

          <p className={styles.text}>
            <strong>Biển số xe:</strong> {trip.licensePlate}
          </p>

          <p className={styles.text}>
            <strong>Giá mỗi ghế:</strong> {formatCurrency(trip.price)}
          </p>

          <div className={styles.status}>
            <span
              className={trip.status === "sẵn sàng" ? styles.statusReady : styles.statusNotReady}
            >
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <button className={styles.detailBtn} onClick={handleDetailTrip}>
        Xem chi tiết
      </button>
    </div>
  );
};

export default TripCardInChatBox;
