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
    fullName: "",
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
    addMutate.mutate(form);
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
          <li className={`${styles["form-group-item"]}`}>
            <label htmlFor="email" className={styles.title}>
              Email
            </label>
            <input
              id="email"
              name={"email"}
              type="text"
              className={styles["form-control"]}
              value={form.email}
              onChange={handleChangeValue}
            />
          </li>

          <li className={`${styles["form-group-item"]}`}>
            <label htmlFor="full-name" className={styles.title}>
              Họ và tên
            </label>
            <input
              id="full-name"
              name={"fullName"}
              type="text"
              className={styles["form-control"]}
              value={form.fullName}
              onChange={handleChangeValue}
            />
          </li>

          <li className={`${styles["form-group-item"]} ${styles["form-group-password"]}`}>
            <label htmlFor="pass" className={styles.title}>
              Mật khẩu
            </label>
            <input
              id="pass"
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
