import styles from "../styles/updatePassword.module.scss";

const UpdatePassword = () => {
  return (
    <div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.title}>
                Cập nhật mật khẩu
            </div>
            <div className={styles.form}>
                <div className={styles.item}>
                    <span>Mật khẩu cũ</span>
                    <input
                    className={styles["input-email"]}
                    type="text"
                />
                </div>
                <div className={styles.item}>
                    <span>Mật khẩu mới</span>
                    <input
                    className={styles["input-password"]}
                    type="text"
                    />  
                </div>
                <div className={styles.item}>
                    <span>Xác nhận mật khẩu</span>
                    <input
                    className={styles["input-cf-password"]}
                    type="text"
                />
                </div>
                <button className={styles.account__updateBtn}>Cập nhật</button>
            </div>
        </div>
    </div>
  );
};

export default UpdatePassword;
