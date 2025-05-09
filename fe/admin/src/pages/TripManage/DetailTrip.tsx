import styles from "../../styles/detailCD.module.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Loading from "../../components/Loading";
import { useEffect } from "react";
import { fetchTrip } from "../../services/trip.service";
import SeatMapNormal from "../../components/SeatMapNormal";
import SeatMapSleeper from "../../components/SeatMapSleeper";
import formatCurrency from "../../utils/formatCurrency";
import { dateTimeTransform } from "../../utils/transform";

const DetailTrip = () => {
  const { id } = useParams();
  const idFetch = id ?? "0";

  const { data, isLoading, error } = useQuery({
    queryKey: ["trip", idFetch],
    queryFn: () => fetchTrip(idFetch),
    staleTime: 5 * 60 * 1000,
  });

  const trip = data?.detailTrip ?? null;

  useEffect(() => {}, [trip]);

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;
  if (!trip) return <p className={styles.error}>Không tìm thấy thông tin chuyến đi</p>;

  return (
    <div className={styles.container}>
      <div className={styles["feat-back"]}>
        <Link to={`/trip-manage`} className={styles["btn-back"]}>
          Quay lại
        </Link>
      </div>
      <div className={styles["detail"]}>
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Thông tin chi tiết</h2>
          <div className={styles["feat-list"]}>
            <Link
              to={`/trip-manage/update/${idFetch}`}
              className={`${styles["btn-update"]} ${styles["feat-item"]}`}
            >
              Cập nhật
            </Link>
            <button className={`${styles["btn-delete"]} ${styles["feat-item"]}`}>Xóa</button>
          </div>
        </div>
        <ul className={styles.detail}>
          {[
            { label: "Tên chuyến đi", value: trip?.name },
            { label: "Tài xế", value: `${trip?.driver.fullName} - ${trip?.driver.phone}` },
          ].map((item, index) => (
            <li key={index} className={styles.group}>
              <p className={styles.title}>{item.label}</p>
              <input className={styles.data} value={item.value ?? "N/A"} readOnly />
            </li>
          ))}

          <li className={styles.group}>
            <p className={styles.title}>Phụ xe</p>
            {trip.coDrivers.map((cdr, index) => (
              <input
                key={index}
                className={styles.data}
                value={`${cdr.fullName ?? "N/A"} - ${cdr.phone ?? "N/A"}`}
                readOnly
              />
            ))}
          </li>

          {trip.car.type === null ? null : trip.car.type === "xe thường" ? (
            <li className={styles["form-group-item"]}>
              <label className={styles.title}>Ghế</label>
              <SeatMapNormal initialSeats={trip.seats} />
            </li>
          ) : (
            <li className={styles["form-group-item"]}>
              <label className={styles.title}>Ghế</label>
              <SeatMapSleeper initialSeats={trip.seats} />
            </li>
          )}
          {[
            { label: "Địa điểm khởi hành", value: trip?.departure?.name },
            { label: "Thời gian khởi hành", value: dateTimeTransform(trip?.startTime) },
            { label: "Địa điểm Đón", value: trip?.arrival?.name },
            {
              label: "Thời gian kết thúc",
              value: dateTimeTransform(trip?.endTime, "DD/MM/YYYY", true),
            },
            { label: "Giá tiền mỗi vé", value: formatCurrency(trip?.price) },
            { label: "Ngày tạo", value: dateTimeTransform(trip?.createAt, "DD/MM/YYYY", true) },
            {
              label: "Ngày cập nhật",
              value: dateTimeTransform(trip?.updateAt, "DD/MM/YYYY", true),
            },
          ].map((item, index) => (
            <li key={index} className={styles.group}>
              <p className={styles.title}>{item.label}</p>
              <input className={styles.data} value={item.value ?? "N/A"} readOnly />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DetailTrip;
