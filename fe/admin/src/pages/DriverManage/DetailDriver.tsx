import styles from "../../styles/detailCD.module.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Loading from "../../components/Loading";
import { useEffect } from "react";
import DefaultImage from "../../components/DefaultImage";
import { fetchDriver } from "../../services/driver.service";

const DetailDriver = () => {
  const { id } = useParams();
  const idFetch = id ?? "0";

  const { data, isLoading, error } = useQuery({
    queryKey: ["driver", idFetch],
    queryFn: () => fetchDriver(idFetch),
    staleTime: 5 * 60 * 1000,
  });

  const driver = data ?? null;

  useEffect(() => {}, [driver]);

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;
  if (!driver) return <p className={styles.error}>Không tìm thấy thông tin khách hàng</p>;

  return (
    <div className={styles.container}>
      <div className={styles["feat-back"]}>
        <Link to={`/driver-manage`} className={styles["btn-back"]}>
          Quay lại
        </Link>
      </div>
      <div className={styles["detail"]}>
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Thông tin chi tiết</h2>
          <div className={styles["feat-list"]}>
            <Link
              to={`/driver-manage/update/${driver?.id}`}
              className={`${styles["btn-update"]} ${styles["feat-item"]}`}
            >
              Cập nhật
            </Link>
            <button className={`${styles["btn-delete"]} ${styles["feat-item"]}`}>Xóa</button>
          </div>
        </div>
        <ul className={styles.detail}>
          <li className={`${styles["item__img"]} ${styles.group}`}>
            <p className={styles.title}>Ảnh đại diện</p>
            <div className={styles.img}>
              <DefaultImage src={driver?.urlImg} />
            </div>
          </li>
          {[
            { label: "email", value: driver?.email },
            { label: "họ và tên", value: driver?.fullName },
            { label: "giới tính", value: driver?.sex },
            { label: "thành phố đang làm việc", value: driver?.location.name },
            { label: "số điện thoại", value: driver?.phone },
            {
              label: "ngày sinh",
              value: driver?.dateBirth.split("T")[0],
            },
            { label: "Mã giấy phép lái xe", value: driver?.licenseNumber },
            {
              label: "Ngày cấp",
              value: driver?.experienceYears.split("T")[0],
            },
            { label: "địa chỉ", value: driver?.address },
            { label: "ngày tạo", value: driver?.createAt.split(" ")[1] },
            { label: "ngày cập nhật", value: driver?.updateAt.split(" ")[1] },
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

export default DetailDriver;
