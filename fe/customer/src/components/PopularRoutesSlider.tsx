import React from "react";
import styles from "../styles/popularRoutesSlider.module.scss";

const PopularRoutesSlider = () => {
  const routeData = [
  {
    city: 'Tp Hồ Chí Minh',
    image: 'https://cdn.futabus.vn/futa-busline-cms-dev/Rectangle_23_2_8bf6ed1d78/Rectangle_23_2_8bf6ed1d78.png',
    routes: [
      { to: 'Đà Lạt', distance: '305km', time: '8 giờ', date: '16/05/2025', price: '290.000đ' },
      { to: 'Cần Thơ', distance: '166km', time: '5 giờ', date: '16/05/2025', price: '165.000đ' },
      { to: 'Long Xuyên', distance: '203km', time: '5 giờ', date: '16/05/2025', price: '190.000đ' },
    ]
  },
{
    city: 'Tp Hồ Chí Minh',
    image: 'https://cdn.futabus.vn/futa-busline-cms-dev/Rectangle_23_3_2d8ce855bc/Rectangle_23_3_2d8ce855bc.png',
    routes: [
      { to: 'Đà Lạt', distance: '305km', time: '8 giờ', date: '16/05/2025', price: '290.000đ' },
      { to: 'Cần Thơ', distance: '166km', time: '5 giờ', date: '16/05/2025', price: '165.000đ' },
      { to: 'Long Xuyên', distance: '203km', time: '5 giờ', date: '16/05/2025', price: '190.000đ' },
    ]
  },
  {
    city: 'TP Đà Nẵng',
    image: 'https://cdn.futabus.vn/futa-busline-cms-dev/Rectangle_23_4_061f4249f6/Rectangle_23_4_061f4249f6.png',
    routes: [
      { to: 'Đà Lạt', distance: '305km', time: '8 giờ', date: '16/05/2025', price: '290.000đ' },
      { to: 'Cần Thơ', distance: '166km', time: '5 giờ', date: '16/05/2025', price: '165.000đ' },
      { to: 'Long Xuyên', distance: '203km', time: '5 giờ', date: '16/05/2025', price: '190.000đ' },
    ]
  },
];
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>TUYẾN PHỔ BIẾN</h2>
      <p className={styles.subTitle}>Được khách hàng tin tưởng và lựa chọn</p>

      <div className={styles.routeWrapper}>
        {routeData.map((item, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.imageWrap}>
              <img src={item.image} alt={item.city} />
              <div className={styles.overlay}>
                <p>Tuyến xe từ</p>
                <h3>{item.city}</h3>
              </div>
            </div>
            <div className={styles.routeList}>
              {item.routes.map((route, index) => (
                <div key={index} className={styles.routeItem}>
                  <div>
                    <strong>{route.to}</strong>
                    <p>{`${route.distance} - ${route.time} - ${route.date}`}</p>
                  </div>
                  <span>{route.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularRoutesSlider;