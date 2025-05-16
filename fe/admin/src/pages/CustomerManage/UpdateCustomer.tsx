import styles from "../../styles/updateCD.module.scss";
import { Link } from "react-router-dom";
import { dateTimeTransform } from "../../utils/transform";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomer, updateInfoCustomer } from "../../services/customer.service";
import Loading from "../../components/Loading";
import DefaultImage from "../../components/DefaultImage";
import { useCustomNavMutation } from "../../hooks/useCustomQuery";

const UpdateCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const idFetch = id ?? "0";
  const dateBirthRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["customer", idFetch],
    queryFn: () => fetchCustomer(idFetch),
    staleTime: 5 * 60 * 1000,
  });

  const customer = data ?? null;

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
    updateInfoCustomer,
    "/customer-manage",
    "Cập nhật thông tin khách hàng thành công",
    "Cập nhật thông tin khách hàng thất bại"
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

  const handleUpdateCustomer = () => {
    const { id, ...data } = form;
    if (id) {
      updateMutate.mutate({ id: Number(id), data });
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
    if (customer) {
      setForm({
        id: id,
        fullName: customer.fullName ?? "",
        password: "",
        sex: customer.sex ?? "",
        phone: customer.phone ?? "",
        address: customer.address ?? "",
        dateBirth: customer.dateBirth?.split("T")[0] ?? "",
        email: customer.email ?? "",
      });
    }
  }, [customer]);

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;
  if (!customer) return <p className={styles.error}>Không tìm thấy thông tin khách hàng</p>;

  return (
    <div className={styles.container}>
      <div className={styles["feats"]}>
        <Link to={`/customer-manage`} className={`${styles["btn-back"]} ${styles.btn}`}>
          Quay lại
        </Link>
        <button className={`${styles["btn-delete"]} ${styles.btn}`}>Xóa</button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateCustomer();
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
              src={customer.urlImg}
              id={Number(idFetch)}
              updateType={"customer"}
              publicId={customer.urlPublicImg}
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Email</p>
            <input type="text" className={styles.data} value={customer.email} readOnly />
          </li>

          <li className={styles.item}>
            <p className={styles.title}>Họ và tên</p>
            <input
              name="fullName"
              onChange={handleChangeValue}
              type="text"
              className={styles.data}
              value={customer.fullName}
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
              value={customer.address}
              readOnly
            />
          </li>

          {/* Trường chỉ đọc */}
          <li className={styles.item}>
            <p className={styles.title}>Đăng ký bằng</p>
            <input
              type="text"
              className={styles.data}
              value={customer.provider ?? "N/A"}
              readOnly
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Ngày tạo</p>
            <input
              type="text"
              className={styles.data}
              value={dateTimeTransform(customer.createAt, "DD-MM-YYYY")}
              readOnly
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Ngày cập nhật</p>
            <input
              type="text"
              className={styles.data}
              value={dateTimeTransform(customer.updateAt, "DD-MM-YYYY")}
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

export default UpdateCustomer;
