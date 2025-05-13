import styles from "../styles/schedule.module.scss";

const Schedule = () => {
  return (
    <div className={styles.main}>
          <div className={styles["search-bar"]}>
            <input className={styles.departure} type="text" placeholder="Nhập điểm đi" />
            <button className={styles["switch-button"]}>⇄</button>
            <input className={styles.destination} type="text" placeholder="Nhập điểm đến" />
          </div>

          <div className={styles.content}>
            <table className={styles.table}>
            <thead>
              <tr>
                <th>Tuyến xe</th>
                <th>Loại xe</th>
                <th>Quãng đường</th>
                <th>Thời gian hành trình</th>
                <th>Giá vé</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>An Hữu (Tiền Giang) ⇄ TP.Hồ Chí Minh</td>
                <td>Limousine</td>
                <td>123km</td>
                <td>2 giờ</td>
                <td>---</td>
                <td><button className="search-btn">Tìm tuyến xe</button></td>
              </tr>

              <tr>
                <td>An Hữu (Tiền Giang) ⇄ TP.Hồ Chí Minh</td>
                <td>Limousine</td>
                <td>123km</td>
                <td>2 giờ</td>
                <td>---</td>
                <td><button className="search-btn">Tìm tuyến xe</button></td>
              </tr>
            </tbody>
            </table>
          </div>
        </div>

  );
};

export default Schedule;
