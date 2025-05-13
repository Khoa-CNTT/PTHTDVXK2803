import styles from "../styles/lookup.module.scss";

const Lookup = () => {
  return (
     <div className={styles.lookup}>
          <span>TRA CỨU THÔNG TIN ĐẶT VÉ</span>
          <input className={styles["text-phone"]} type="text" placeholder="Vui lòng nhập số điện thoại" />
          <input className={styles["text-ticket"]} type="text" placeholder="Vui lòng nhập mã vé" />
          <button className={styles["search-button"]}>Tra cứu</button>
        </div>
  );
};

export default Lookup;
