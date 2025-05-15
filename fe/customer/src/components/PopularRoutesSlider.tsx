import React from "react";
import Slider from "react-slick";
import styles from "../styles/popularRoutesSlider.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const PopularRoutesSlider = () => {
    const routeData = [
  {
    image:
      "https://cdn.futabus.vn/futa-busline-cms-dev/Rectangle_23_2_8bf6ed1d78/Rectangle_23_2_8bf6ed1d78.png",
    city: "Tp Hồ Chí Minh",
    routes: [
      { to: "Đà Lạt", distance: "310km", time: "11 giờ", price: "350.000đ" },
      { to: "Cần Thơ", distance: "167km", time: "4 giờ 30 phút", price: "0đ" },
      { to: "Long Xuyên", distance: "186km", time: "5 giờ", price: "200.000đ" },
    ],
  },
  {
    image:
      "https://cdn.futabus.vn/futa-busline-cms-dev/Rectangle_23_3_2d8ce855bc/Rectangle_23_3_2d8ce855bc.png",
    city: "Đà Lạt",
    routes: [
      { to: "TP.Hồ Chí Minh", distance: "293km", time: "8 giờ", price: "300.000đ" },
      { to: "Đà Nẵng", distance: "757km", time: "17 giờ", price: "800.000đ" },
      { to: "Cần Thơ", distance: "457km", time: "11 giờ", price: "500.000đ" },
    ],
  },
  {
    image:
      "https://cdn.futabus.vn/futa-busline-cms-dev/Rectangle_23_4_061f4249f6/Rectangle_23_4_061f4249f6.png",
    city: "Đà Nẵng",
    routes: [
      { to: "Đà Lạt", distance: "666km", time: "17 giờ", price: "700.000đ" },
      { to: "TP.Hồ Chí Minh", distance: "850km", time: "23 giờ", price: "900.000đ" },
      { to: "Nha Trang", distance: "543km", time: "12 giờ", price: "500.000đ" },
    ],
  },
];
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>TUYẾN PHỔ BIẾN</h2>
      <p className={styles.subtitle}>Được khách hàng tin tưởng và lựa chọn</p>
      <Slider {...settings}>
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
                    <p>{`${route.distance} - ${route.time}`}</p>
                  </div>
                  <span>{route.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PopularRoutesSlider;
