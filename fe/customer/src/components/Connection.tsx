import React from "react";
import styles from "../styles/connection.module.scss";


const Connection = () => {
    const items = [
  {
    icon: "	", 
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
      <h2 className={styles.title}>KẾT NỐI VEXETIENICH</h2>
      <p className={styles.description}>
        Kết nối với chúng tôi qua: mua vé Xe Khách, Xe Buýt, Xe Hợp Đồng, Giao Hàng,...
      </p>
      <div className={styles.itemList}>
        <img  src="https://cdn.futabus.vn/futa-busline-cms-dev/1_ketnoi_3c401512ac/1_ketnoi_3c401512ac.svg"/>
      </div>
    </section>
  );
};

export default Connection;
