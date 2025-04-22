import styles from "../../styles/addCD.module.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useCustomNavMutation } from "../../hooks/useCustomQuery";
import { useState } from "react";
import { addAdmin } from "../../services/admin.service";

const AddAdmin = () => {
  const [statePassword, setStatePassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const addMutate = useCustomNavMutation(
    addAdmin,
    "/admin-manage",
    "Thêm mới thành công",
    "Thêm mới thất bại"
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

  const handleAddCoDriver = async () => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(form));
    addMutate.mutate(formData);
  };

  const handleTogglePassword = () => {
    setStatePassword((prev) => !prev);
  };

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
          handleAddCoDriver();
        }}
        className={styles.form}
      >
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Thêm mới admin</h2>
        </div>
        <ul className={styles["form-group-list"]}>
          <li className={`${styles["form-group-item"]} ${styles["form-group-password"]}`}>
            <p className={styles.title}>Email</p>
            <input
              name={"email"}
              type="text"
              className={styles["form-control"]}
              value={form.email}
              onChange={handleChangeValue}
            />
          </li>

          <li className={`${styles["form-group-item"]} ${styles["form-group-password"]}`}>
            <p className={styles.title}>Mật khẩu</p>
            <input
              name={"password"}
              type={statePassword ? "text" : "password"}
              className={styles["form-control"]}
              value={form.password}
              onChange={handleChangeValue}
            />
            <span className={styles["pass-status"]} onClick={handleTogglePassword}>
              {statePassword ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </span>
          </li>
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

export default AddAdmin;
