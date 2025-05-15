import React from "react";
import styles from "../styles/connection.module.scss";


const Connection = () => {
    const items = [
  {
    icon: "/icons/car-clock.png",  // thay bằng đường dẫn icon đúng
    label: "Xe Hợp Đồng",
    highlight: false,
  },
  {
    icon: "/icons/bus-orange.png",
    label: "Mua vé Phương Trang",
    highlight: true,
  },
  {
    icon: "/icons/delivery.png",
    label: "Giao Hàng",
    highlight: false,
  },
  {
    icon: "/icons/bus-stop.png",
    label: "Xe Buýt",
    highlight: false,
  },
];

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>KẾT NỐI FUTA GROUP</h2>
      <p className={styles.description}>
        Kết nối đa dạng hệ sinh thái FUTA Group qua App FUTA: mua vé Xe Phương Trang, Xe Buýt, Xe Hợp Đồng, Giao Hàng,...
      </p>
      <div className={styles.itemList}>
        {items.map(({ icon, label, highlight }, index) => (
          <div
            key={index}
            className={`${styles.item} ${highlight ? styles.highlight : ""}`}
          >
            <div className={styles.iconWrap}>
              <img src={icon} alt={label} />
            </div>
            <p className={styles.label}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Connection;
