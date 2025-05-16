import styles from "../../styles/updateCD.module.scss";
import { Link } from "react-router-dom";
import { dateTimeTransform } from "../../utils/transform";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import { useCustomNavMutation } from "../../hooks/useCustomQuery";
import { fetchAdmin, updateInfoAdmin } from "../../services/admin.service";

const UpdateAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const idFetch = id ?? "0";

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", idFetch],
    queryFn: () => fetchAdmin(idFetch),
    staleTime: 5 * 60 * 1000,
  });

  const admin = data ?? null;

  const [form, setForm] = useState({
    id: id,
    password: "",
    email: "",
  });

  const updateMutate = useCustomNavMutation(
    updateInfoAdmin,
    "/admin-manage",
    "Cập nhật thông tin admin thành công",
    "Cập nhật thông tin admin thất bại"
  );

  const handleChangeValue = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((prevForm) => {
      return {
        ...prevForm,
        [name]: value,
      };
    });
  };

  const handleUpdateAdmin = async () => {
    const { id, ...data } = form;
    if (id) {
      await updateMutate.mutateAsync({ id: Number(id), data });
    } else {
      return;
    }
  };

  useEffect(() => {
    if (admin) {
      setForm({
        id: id,
        password: "",
        email: admin.email ?? "",
      });
    }
  }, [admin]);

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;
  if (!admin) return <p className={styles.error}>Không tìm thấy thông tin admin</p>;

  return (
    <div className={styles.container}>
      <div className={styles["feats"]}>
        <Link to={`/admin-manage`} className={`${styles["btn-back"]} ${styles.btn}`}>
          Quay lại
        </Link>
        <button className={`${styles["btn-delete"]} ${styles.btn}`}>Xóa</button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateAdmin();
        }}
        className={styles.update}
      >
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Thông tin cập nhật</h2>
        </div>
        <ul className={styles["data-list"]}>
          <li className={styles.item}>
            <p className={styles.title}>Email</p>
            <input type="text" className={styles.data} value={admin.email} readOnly />
          </li>

          <li className={styles.item}>
            <p className={styles.title}>Mật khẩu</p>
            <input
              name="password"
              onChange={handleChangeValue}
              type="password"
              className={styles.data}
              value={admin.password}
            />
          </li>

          <li className={styles.item}>
            <p className={styles.title}>Ngày tạo</p>
            <input
              type="text"
              className={styles.data}
              value={dateTimeTransform(admin.createAt, "DD-MM-YYYY")}
              readOnly
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Ngày cập nhật</p>
            <input
              type="text"
              className={styles.data}
              value={dateTimeTransform(admin.updateAt, "DD-MM-YYYY")}
              readOnly
            />
          </li>

          <div className={styles["feat-update"]}>
            <button type="submit" className={styles["btn-update"]}>
              Cập Nhật
            </button>
          </div>
        </ul>
      </form>
    </div>
  );
};

export default UpdateAdmin;
