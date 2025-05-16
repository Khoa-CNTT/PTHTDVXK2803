import styles from "../../styles/detailCD.module.scss";
import { Link } from "react-router-dom";
import { dateTimeTransform } from "../../utils/transform";
import { fetchCustomer } from "../../services/customer.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Loading from "../../components/Loading";
import { useEffect } from "react";
import DefaultImage from "../../components/DefaultImage";

const DetailCustomer = () => {
  const { id } = useParams();
  const idFetch = id ?? "0";

  const { data, isLoading, error } = useQuery({
    queryKey: ["customer", idFetch],
    queryFn: () => fetchCustomer(idFetch),
    staleTime: 5 * 60 * 1000,
  });

  const customer = data ?? null;

  useEffect(() => {}, [customer]);

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;
  if (!customer) return <p className={styles.error}>Không tìm thấy thông tin khách hàng</p>;

  return (
    <div className={styles.container}>
      <div className={styles["feat-back"]}>
        <Link to={`/customer-manage`} className={styles["btn-back"]}>
          Quay lại
        </Link>
      </div>
      <div className={styles["detail"]}>
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Thông tin chi tiết</h2>
          <div className={styles["feat-list"]}>
            <Link
              to={`/customer-manage/update/${customer?.id}`}
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
              <DefaultImage src={customer?.urlImg} />
            </div>
          </li>
          {[
            { label: "email", value: customer?.email },
            { label: "họ và tên", value: customer?.fullName },
            { label: "giới tính", value: customer?.sex },
            { label: "số điện thoại", value: customer?.phone },
            {
              label: "ngày sinh",
              value: dateTimeTransform(customer?.dateBirth, "DD-MM-YYYY", false),
            },
            { label: "Đăng ký bằng", value: customer?.provider },
            { label: "địa chỉ", value: customer?.address },
            { label: "ngày tạo", value: dateTimeTransform(customer?.createAt, "DD-MM-YYYY") },
            { label: "ngày cập nhật", value: dateTimeTransform(customer?.updateAt, "DD-MM-YYYY") },
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

export default DetailCustomer;
