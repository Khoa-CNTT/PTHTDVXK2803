import { useState } from "react";
import styles from "../styles/profile.module.scss";

const Profile = () => {
    const [avatar , setAvatar] = useState("https://randomuser.me/api/portraits/men/1.jpg")

  return (
    <div className={styles.container}>
      <div className={styles.account}>
      <h2 className={styles.account__title}>Thông tin tài khoản</h2>
      <p className={styles.account__subtitle}>
        Quản lý thông tin hồ sơ để bảo mật tài khoản
      </p>

      <div className={styles.account__card}>
        <div className={styles.account__avatar}>
          <img
            src={avatar}
            alt="Avatar"
          />
          <input id="avatar" hidden type="file" 
              // onChange={(e) => handleOnchangeAvater(e)}
          />
          <label htmlFor="avatar" className={styles.label}>Chọn ảnh</label>
          <p className={styles.account__note}>
            Dung lượng file tối đa 1 MB<br />Định dạng: .JPEG, .PNG
          </p>
        </div>

        <div className={styles.account__info}>
          <div className={styles.info__item}>
            <label>Họ và tên:</label>
            <span>văn lân</span>
          </div>
          <div className={styles.info__item}>
            <label>Số điện thoại:</label>
            <span>0889531836</span>
          </div>
          <div className={styles.info__item}>
            <label>Giới tính:</label>
            <select>
              <option value="">-- Chọn giới tính --</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div className={styles.info__item}>
            <label>Email:</label>
            <span>lanngo1592003@gmail.com</span>
          </div>
          <div className={styles.info__item}>
            <label>Ngày sinh:</label>
            <input
              className={styles["input-date"]}
              type="text"
              />
          </div>
          <div className={styles.info__item}>
            <label>Địa chỉ:</label>
            <input
              className={styles["input-address"]}
              type="text"
              />
          </div>
          <div className={styles.info__item}>
            <label>Nghề nghiệp:</label>
            <input
              className={styles["input-job"]}
              type="text"
              />
          </div>
          <button className={styles.account__updateBtn}>Cập nhật</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;
