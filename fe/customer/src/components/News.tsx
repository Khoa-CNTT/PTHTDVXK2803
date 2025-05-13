import styles from "../styles/news.module.scss";

const News = () => {
    const newsData = [
  {
    image: "	https://cdn.futabus.vn/futa-busline-web-cms-prod/1029x552_8d819274f6/1029x552_8d819274f6.jpg",
    title: "CÔNG TY PHƯƠNG TRANG KHAI TRƯƠNG VĂN PHÒNG VẠN GIÃ (KHÁNH HÒA)",
    time: "10:04 08/05/2025",
  },
  {
    image: "https://cdn.futabus.vn/futa-busline-web-cms-prod/599x337_fa6a13bcb8/599x337_fa6a13bcb8.png",
    title: "CÔNG TY PHƯƠNG TRANG MỞ RỘNG MẠNG LƯỚI, KHAI TRƯƠNG VĂN PHÒNG BUÔN HỒ",
    time: "14:04 06/05/2025",
  },
  {
    image: "https://cdn.futabus.vn/futa-busline-web-cms-prod/1797x1011_b7f3b31692/1797x1011_b7f3b31692.jpg",
    title: "CÔNG TY PHƯƠNG TRANG KHAI TRƯƠNG VĂN PHÒNG LỘC AN (BẢO LÂM)",
    time: "25/04/2025",
  },
  {
    image: "https://cdn.futabus.vn/futa-busline-web-cms-prod/599x337_7086fb2b4f/599x337_7086fb2b4f.png",
    title: "KHAI TRƯƠNG VĂN PHÒNG DĨ AN – PHỤC VỤ KHÁCH HÀNG BÌNH DƯƠNG",
    time: "27/04/2025",
  },
  {
    image: "https://cdn.futabus.vn/futa-busline-web-cms-prod/599x337_7086fb2b4f/599x337_7086fb2b4f.png",
    title: "KHAI TRƯƠNG VĂN PHÒNG DĨ AN – PHỤC VỤ KHÁCH HÀNG BÌNH DƯƠNG",
    time: "27/04/2025",
  },
  {
    image: "https://cdn.futabus.vn/futa-busline-web-cms-prod/599x337_7086fb2b4f/599x337_7086fb2b4f.png",
    title: "KHAI TRƯƠNG VĂN PHÒNG DĨ AN – PHỤC VỤ KHÁCH HÀNG BÌNH DƯƠNG",
    time: "27/04/2025",
  },
  {
    image: "https://cdn.futabus.vn/futa-busline-web-cms-prod/599x337_6fd79b6580/599x337_6fd79b6580.png",
    title: "KHAI TRƯƠNG VĂN PHÒNG DĨ AN – PHỤC VỤ KHÁCH HÀNG BÌNH DƯƠNG",
    time: "27/04/2025",
  },
  {
    image: "https://cdn.futabus.vn/futa-busline-web-cms-prod/1797x1011_444e6b049f/1797x1011_444e6b049f.jpg",
    title: "KHAI TRƯƠNG VĂN PHÒNG DĨ AN – PHỤC VỤ KHÁCH HÀNG BÌNH DƯƠNG",
    time: "27/04/2025",
  },
  	
];
  return (
     <div className={styles.information}>
          <span>Tin tức nổi bật</span>
          <div className={styles.newsGrid}>
            {newsData.map((news, index) => (
              <div className={styles.newsCard} key={index}>
                <img src={news.image} alt={news.title} />
                <h3>{news.title}</h3>
                <p>{news.time}</p>
              </div>
            ))}
          </div>
        </div>
  );
};

export default News;
