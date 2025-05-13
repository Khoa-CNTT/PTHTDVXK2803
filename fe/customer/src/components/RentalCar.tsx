import styles from "../styles/rentalCar.module.scss";

const RentalCar = () => {
  return (
      <div className={styles["rental-car-container"]}>
            <div className={styles.content}>
                <div className={styles.description}>
                    <img src='https://vexere.com/vn/thue-xe/wp-content/uploads/2022/07/Thue-xe-Limousine-Phan-Thiet-Mui-Ne2.jpg'/>
                    <div className={styles.text}>
                      <h4>
                        Dịch vụ thuê xe du lịch giá rẻ
                      </h4>
                      <ul>
                        <li>Thông tin rõ ràng, minh bạch</li>
                        <li>Nhận báo giá nhanh chóng, chi tiết</li>
                        <li>Xe chất lượng cao, đa dạng chủng loại</li>
                        <li>Hỗ trợ chu đáo, tận tình 24/7</li>
                      </ul>
                      <button className={styles["btn-rental"]}>Đăng ký thuê xe</button>
                    </div>
                </div>
                <div className={styles.action}>
                  <div className={styles.top}>
                    Thuê xe du lịch cùng VEXE trong 3 bước
                  </div>
                <div className={styles.container}>
                <div className={styles.bottom}>
                    <div className={styles.item}>
                      <div className={styles.name}>Mô tả lịch trình</div>
                      <div className={styles.detail}>Mô tả chi tiết lịch trình theo từng gói dịch vụ sẽ giúp Vexere tính toán và báo giá cho bạn tốt hơn.​</div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.name}>Nhận báo giá chi tiết</div>
                      <div className={styles.detail}>Giá thuê xe tại Vexere là giá trọn gói dịch vụ, bạn sẽ không phải trả thêm bất cứ chi phí gì.​</div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.name}>Xác nhận thuê xe</div>
                      <div className={styles.detail}>Xác nhận thuê xe sẽ được gửi tới bạn qua tin nhắn hoặc email. Sẵn sàng tận hưởng chuyến đi thôi!​</div>
                    </div>
                  </div>
                </div>
                </div>
            </div>
        </div>
  );
};

export default RentalCar;
