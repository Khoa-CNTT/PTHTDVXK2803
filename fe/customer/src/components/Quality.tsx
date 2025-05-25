import React from 'react';
import styles from "../styles/quality.module.scss";

const Quality = () => {
  return (
    <div className={styles.container}>
      <h2>
       VÉ XE TIỆN ÍCH - <span>CHẤT LƯỢNG LÀ DANH DỰ</span>
      </h2>
      <p className={styles.subTitle}>Được khách hàng tin tưởng và lựa chọn</p>

      <div className={styles.content}>
        <div className={styles.statsList}>
          <div className={styles.statItem}>
            <img src="https://cdn.futabus.vn/futa-busline-cms-dev/Group_662c4422ba/Group_662c4422ba.svg" alt="Hơn 40 triệu lượt khách" className={styles.icon} />
            <div className={styles.text}>
              <strong>Hơn 5 Triệu <span>Lượt khách</span></strong>
              <p>VEXETIECICH phục vụ hơn 5 triệu lượt khách bình quân 1 năm trên toàn quốc</p>
            </div>
          </div>

          <div className={styles.statItem}>
            <img src="https://cdn.futabus.vn/futa-busline-cms-dev/Store_55c0da8bd7/Store_55c0da8bd7.svg" alt="Hơn 350 phòng vé" className={styles.icon} />
            <div className={styles.text}>
              <strong>Hơn 10 <span>Phòng vé - Bưu cục</span></strong>
              <p>VEXETIENICH có hơn 10 phòng vé, trạm trung chuyển, bến xe,... trên toàn hệ thống</p>
            </div>
          </div>

          <div className={styles.statItem}>
            <img src="https://cdn.futabus.vn/futa-busline-cms-dev/Group_2_75b5ed1dfd/Group_2_75b5ed1dfd.svg" alt="Hơn 6.500 chuyến xe" className={styles.icon} />
            <div className={styles.text}>
              <strong>Hơn 1000 <span>Chuyến xe</span></strong>
              <p>VEXETIENICH phục vụ hơn 1000 chuyến xe đường dài và liên tỉnh mỗi ngày</p>
            </div>
          </div>
        </div>

        <div className={styles.image}>
          <img src="https://cdn.futabus.vn/futa-busline-cms-dev/image_f922bef1bb/image_f922bef1bb.svg" alt="travel illustration" />
        </div>
      </div>
    </div>
  );
};

export default Quality;
