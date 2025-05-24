import { useParams } from "react-router";
import styles from "../../styles/detailBus.module.scss";
import { useQuery } from "@tanstack/react-query";
import { getDetailBus } from "../../services/bus.service";
import Loading from "../../components/Loading";
import { dateTimeTransform } from "../../utils/transform";
import { Link } from "react-router-dom";
import ImageList from "../../components/ImageList";

const DetailBus = () => {
  const { licensePlate } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["bus", licensePlate],
    queryFn: () => getDetailBus(licensePlate || ''),
    staleTime: 5 * 60 * 1000,
  });

  const bus = data ?? null;
  const imageList = bus?.images ?? null;

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;

  return (
    <div className={styles.container}>
      <div className={styles["feat-back"]}>
        <Link to={`/bus-manage`} className={styles["btn-back"]}>
          Quay lại
        </Link>
      </div>
      <div className={styles["detail-bus"]}>
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Thông tin chi tiết</h2>
          <div className={styles["feat-list"]}>
            <Link
              to={`/bus-manage/update/${licensePlate}`}
              className={`${styles["btn-update"]} ${styles["feat-item"]}`}
            >
              Cập nhật
            </Link>
            <button className={`${styles["btn-delete"]} ${styles["feat-item"]}`}>Xóa</button>
          </div>
        </div>
        <ul className={styles.detail}>
          {[
            { label: "Biển số xe", value: bus?.licensePlate },
            { label: "Sức chứa", value: bus?.capacity },
            { label: "Loại xe", value: bus?.type },
            { label: "Thành phố đang ở hiện tại:", value: bus?.location?.name },
            { label: "Ngày tạo", value: dateTimeTransform(bus?.createAt, "DD-MM-YYYY") },
            { label: "Ngày cập nhật", value: dateTimeTransform(bus?.updateAt, "DD-MM-YYYY") },
          ].map((item, index) => (
            <li key={index} className={styles.group}>
              <p className={styles.title}>{item.label}</p>
              <input className={styles.data} value={item.value ?? "N/A"} readOnly />
            </li>
          ))}
          <li className={`${styles.group}`}>
            <p className={`${styles.title}`}>Hình ảnh</p>
            <ImageList data={imageList ?? []} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DetailBus;
