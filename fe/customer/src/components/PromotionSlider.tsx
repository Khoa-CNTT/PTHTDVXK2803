import React from 'react';
import Slider from 'react-slick';
import styles from "../styles/promotionSlider.module.scss";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PromotionSlider = () => {
  const promotions = [
    'https://cdn.futabus.vn/futa-busline-web-cms-prod/599x337px_0b9afca624/599x337px_0b9afca624.png',
    'https://cdn.futabus.vn/futa-busline-web-cms-prod/599x337px_0b9afca624/599x337px_0b9afca624.png',
    'https://cdn.futabus.vn/futa-busline-web-cms-prod/599x337px_0b9afca624/599x337px_0b9afca624.png',
    'https://cdn.futabus.vn/futa-busline-web-cms-prod/599x337px_0b9afca624/599x337px_0b9afca624.png'
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
    <div className={styles.sliderWrapper}>
      <div className={styles.title}>KHUYẾN MÃI NỔI BẬT</div>
      <Slider {...settings}>
        {promotions.map((imgSrc, index) => (
          <div key={index} className={styles.slide}>
            <img src={imgSrc} alt={`Promotion ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PromotionSlider;
