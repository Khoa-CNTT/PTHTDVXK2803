import styles from "../../styles/detailCD.module.scss";
import { Link } from "react-router-dom";
import { dateTimeTransform } from "../../utils/transform";
import { fetchCoDriver } from "../../services/coDriver.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Loading from "../../components/Loading";
import { useEffect } from "react";
import DefaultImage from "../../components/DefaultImage";

const DetailCoDriver = () => {
  const { id } = useParams();
  const idFetch = id ?? "0";

  const { data, isLoading, error } = useQuery({
    queryKey: ["coDriver", idFetch],
    queryFn: () => fetchCoDriver(idFetch),
    staleTime: 5 * 60 * 1000,
  });

  const coDriver = data ?? null;

  useEffect(() => {}, [coDriver]);

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;
  if (!coDriver) return <p className={styles.error}>Không tìm thấy thông tin khách hàng</p>;

  return (
    <div className={styles.container}>
      <div className={styles["feat-back"]}>
        <Link to={`/co-driver-manage`} className={styles["btn-back"]}>
          Quay lại
        </Link>
      </div>
      <div className={styles["detail"]}>
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Thông tin chi tiết</h2>
          <div className={styles["feat-list"]}>
            <Link
              to={`/co-driver-manage/update/${coDriver?.id}`}
              className={`${styles["btn-update"]} ${styles["feat-item"]}`}
            >
              Cập nhật
            </Link>
          </div>
        </div>
        <ul className={styles.detail}>
          <li className={`${styles["item__img"]} ${styles.group}`}>
            <p className={styles.title}>Ảnh đại diện</p>
            <div className={styles.img}>
              <DefaultImage src={coDriver?.urlImg} />
            </div>
          </li>
          {[
            { label: "email", value: coDriver?.email },
            { label: "họ và tên", value: coDriver?.fullName },
            { label: "giới tính", value: coDriver?.sex },
            { label: "thành phố đang làm việc", value: coDriver?.location.name },
            { label: "số điện thoại", value: coDriver?.phone },
            {
              label: "ngày sinh",
              value: dateTimeTransform(coDriver?.dateBirth, "DD-MM-YYYY", false),
            },
            { label: "địa chỉ", value: coDriver?.address },
            { label: "ngày tạo", value: dateTimeTransform(coDriver?.createAt, "DD-MM-YYYY") },
            { label: "ngày cập nhật", value: dateTimeTransform(coDriver?.updateAt, "DD-MM-YYYY") },
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

export default DetailCoDriver;
