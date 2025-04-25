import styles from "../../styles/detailCD.module.scss";
import { Link } from "react-router-dom";
import { dateTimeTransform } from "../../utils/transform";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Loading from "../../components/Loading";
import { useEffect } from "react";
import { fetchAdmin } from "../../services/admin.service";

const DetailAdmin = () => {
  const { id } = useParams();
  const idFetch = id ?? "0";

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", idFetch],
    queryFn: () => fetchAdmin(idFetch),
    staleTime: 5 * 60 * 100,
  });

  const admin = data ?? null;

  useEffect(() => {}, [admin]);

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;
  if (!admin) return <p className={styles.error}>Không tìm thấy thông tin admins</p>;

  return (
    <div className={styles.container}>
      <div className={styles["feat-back"]}>
        <Link to={`/admin-manage`} className={styles["btn-back"]}>
          Quay lại
        </Link>
      </div>
      <div className={styles["detail"]}>
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Thông tin chi tiết</h2>
          <div className={styles["feat-list"]}>
            <Link
              to={`/admin-manage/update/${admin?.id}`}
              className={`${styles["btn-update"]} ${styles["feat-item"]}`}
            >
              Cập nhật
            </Link>
            <button className={`${styles["btn-delete"]} ${styles["feat-item"]}`}>Xóa</button>
          </div>
        </div>
        <ul className={styles.detail}>
          {[
            { label: "email", value: admin?.email },
            { label: "ngày tạo", value: dateTimeTransform(admin?.createAt, "DD-MM-YYYY") },
            { label: "ngày cập nhật", value: dateTimeTransform(admin?.updateAt, "DD-MM-YYYY") },
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

export default DetailAdmin;
