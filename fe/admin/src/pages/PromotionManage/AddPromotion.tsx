import styles from "../../styles/addCD.module.scss";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useCustomNavMutation } from "../../hooks/useCustomQuery";
import { addPromotion } from "../../services/promotion.service";

const AddPromotion = () => {
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    code: "",
    carType: "",
    type: "",
    discountAmount: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const addMutate = useCustomNavMutation(
    addPromotion,
    "/promotion-manage",
    "Thêm khuyến mãi thành công",
    "Thêm khuyến mãi thất bại"
  );

  const handleChangeValue = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "code" ? value.toUpperCase() : value,
    }));
  };

  const handleAddPromotion = async () => {
    addMutate.mutate(form);
  };

  const handleClickDate = (ref: React.RefObject<HTMLInputElement> | null) => {
    if(ref?.current){
      ref.current?.showPicker();
    }else{
      return
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.feats}>
        <Link to="/promotion-manage" className={`${styles["btn-back"]} ${styles.btn}`}>
          Quay lại
        </Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddPromotion();
        }}
        className={styles.form}
      >
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Thêm mới khuyến mãi</h2>
        </div>
        <ul className={styles["form-group-list"]}>
          {[
            { label: "Mã khuyến mãi", name: "code", type: "text" },
            { label: "Giảm giá", name: "discountAmount", type: "number" },
          ].map((item, index) => (
            <li key={index} className={styles["form-group-item"]}>
              <p className={styles.title}>{item.label}</p>
              <input
                name={item.name}
                type={item.type}
                className={styles["form-control"]}
                min={item.name === "discountAmount" ? 5 : undefined}
                maxLength={item.name === "code" ? 100 : undefined}
                value={form[item.name as keyof typeof form]}
                onChange={handleChangeValue}
              />
            </li>
          ))}

          <li className={styles["form-group-item"]}>
            <p className={styles.title}>Loại xe áp dụng</p>
            <select
              name="carType"
              className={styles["form-control"]}
              value={form.carType}
              onChange={handleChangeValue}
            >
              <option value="">--- Chọn loại xe ---</option>
              <option value="all">Tất cả</option>
              <option value="xe thường">Xe thường</option>
              <option value="xe giường nằm">Xe giường nằm</option>
            </select>
          </li>

          <li className={styles["form-group-item"]}>
            <p className={styles.title}>Loại giảm giá</p>
            <select
              name="type"
              className={styles["form-control"]}
              value={form.type}
              onChange={handleChangeValue}
            >
              <option value="">--- Chọn loại ---</option>
              <option value="percentage">Theo phần trăm</option>
              <option value="fixed">Theo số tiền cố định</option>
            </select>
          </li>

          <li className={styles["form-group-item"]}>
            <p className={styles.title}>Mô tả</p>
            <textarea
              spellCheck={false}
              rows={3}
              name="description"
              className={`${styles["form-control"]} ${styles.textarea}`}
              value={form.description}
              onChange={handleChangeValue}
            />
          </li>

          {[
            { label: "Ngày bắt đầu", name: "startDate", ref: startDateRef },
            { label: "Ngày kết thúc", name: "endDate", ref: endDateRef },
          ].map((item, index) => (
            <li key={index} className={styles["form-group-item"]}>
              <p className={styles.title}>{item.label}</p>
              <input
                ref={item.ref}
                onClick={() => handleClickDate(item.ref && null)}
                name={item.name}
                type="date"
                className={styles["form-control"]}
                value={form[item.name as keyof typeof form]}
                onChange={handleChangeValue}
              />
            </li>
          ))}

          <div className={styles["feat-add"]}>
            <button type="submit" className={styles["btn-add"]}>
              Thêm mới
            </button>
          </div>
        </ul>
      </form>
    </div>
  );
};

export default AddPromotion;
