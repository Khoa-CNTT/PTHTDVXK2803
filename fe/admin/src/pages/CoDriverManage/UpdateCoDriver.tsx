import styles from "../../styles/updateCD.module.scss";
import { Link } from "react-router-dom";
import { dateTimeTransform } from "../../utils/transform";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCoDriver, updateInfoCoDriver } from "../../services/coDriver.service";
import Loading from "../../components/Loading";
import DefaultImage from "../../components/DefaultImage";
import { useCustomNavMutation } from "../../hooks/useCustomQuery";

const UpdateCoDriver = () => {
  const { id } = useParams<{ id: string }>();
  const idFetch = id ?? "0";
  const dateBirthRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["coDriver", idFetch],
    queryFn: () => fetchCoDriver(idFetch),
    staleTime: 5 * 60 * 100,
  });

  const coDriver = data ?? null;

  const [form, setForm] = useState({
    id: id,
    fullName: "",
    password: "",
    sex: "",
    phone: "",
    address: "",
    dateBirth: "",
    email: "",
  });

  const updateMutate = useCustomNavMutation(
    updateInfoCoDriver,
    "/co-driver-manage",
    "Cập nhật thông tin phụ xe thành công",
    "Cập nhật thông tin phụ xe thất bại"
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

  const handleUpdateCoDriver = async () => {
    const { id, ...data } = form;
    if (id) {
      await updateMutate.mutateAsync({ id: Number(id), data });
    } else {
      return;
    }
  };

  const handleClickInputDate = () => {
    if (dateBirthRef.current) {
      dateBirthRef.current.showPicker();
    } else {
      return;
    }
  };

  useEffect(() => {
    if (coDriver) {
      setForm({
        id: id,
        fullName: coDriver.fullName ?? "",
        password: "",
        sex: coDriver.sex ?? "",
        phone: coDriver.phone ?? "",
        address: coDriver.address ?? "",
        dateBirth: coDriver.dateBirth?.split(" ")[0] ?? "",
        email: coDriver.email ?? "",
      });
    }
  }, [coDriver]);

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;
  if (!coDriver) return <p className={styles.error}>Không tìm thấy thông tin khách hàng</p>;

  return (
    <div className={styles.container}>
      <div className={styles["feats"]}>
        <Link to={`/co-driver-manage`} className={`${styles["btn-back"]} ${styles.btn}`}>
          Quay lại
        </Link>
        <button className={`${styles["btn-delete"]} ${styles.btn}`}>Xóa</button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateCoDriver();
        }}
        className={styles.update}
      >
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Thông tin cập nhật</h2>
        </div>
        <ul className={styles["data-list"]}>
          <li className={styles.item}>
            <p className={styles.title}>Hình ảnh</p>
            <DefaultImage
              src={coDriver.urlImg}
              id={Number(idFetch)}
              updateType={"co-driver"}
              publicId={coDriver.urlPublicImg}
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Email</p>
            <input type="text" className={styles.data} value={coDriver.email} readOnly />
          </li>

          <li className={styles.item}>
            <p className={styles.title}>Họ và tên</p>
            <input
              name="fullName"
              onChange={handleChangeValue}
              type="text"
              className={styles.data}
              value={coDriver.fullName}
            />
          </li>

          <li className={styles.item}>
            <p className={styles.title}>Giới tính</p>
            <select
              name="sex"
              className={styles.data}
              value={form.sex}
              onChange={handleChangeValue}
            >
              <option value="">--- Chọn Giới Tính ---</option>
              {["male", "female", "other"].map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </li>

          {[
            { label: "Ngày sinh", name: "dateBirth", type: "date" },
            { label: "Số điện thoại", name: "phone", type: "text" },
            { label: "Mật khẩu", name: "password", type: "password" },
          ].map((item, index) => (
            <li key={index} className={styles.item}>
              <p className={styles.title}>{item.label}</p>
              <input
                ref={item.type === "date" ? dateBirthRef : null}
                onClick={item.type === "date" ? handleClickInputDate : undefined}
                name={item.name}
                type={item.type}
                className={styles.data}
                value={form[item.name as keyof typeof form]}
                onChange={handleChangeValue}
              />
            </li>
          ))}

          <li className={styles.item}>
            <p className={styles.title}>Địa chỉ</p>
            <textarea
              spellCheck={false}
              rows={3}
              name="address"
              onChange={handleChangeValue}
              className={`${styles.data} ${styles.textarea}`}
              value={coDriver.address}
              readOnly
            />
          </li>

          {/* Trường chỉ đọc */}
          <li className={styles.item}>
            <p className={styles.title}>Ngày tạo</p>
            <input
              type="text"
              className={styles.data}
              value={dateTimeTransform(coDriver.createAt, "DD-MM-YYYY")}
              readOnly
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Ngày cập nhật</p>
            <input
              type="text"
              className={styles.data}
              value={dateTimeTransform(coDriver.updateAt, "DD-MM-YYYY")}
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

export default UpdateCoDriver;
