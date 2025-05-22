import React from 'react';
import Slider from 'react-slick';
import styles from "../styles/promotionSlider.module.scss";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import promotion1 from "../assets/images/promotion1.jpg";
import promotion2 from "../assets/images/promotion2.jpg";
import promotion3 from "../assets/images/promotion3.jpg";
import promotion4 from "../assets/images/summer.jpg";
import { useNavigate } from 'react-router';

const PromotionSlider = () => {
  const navigation = useNavigate()

  const promotions = [
    {
    title: "🎉 ƯU ĐÃI ĐẶC BIỆT – TẶNG NGAY VOUCHER 80.000Đ 🎁",
    description: "Bạn đang có kế hoạch đi lại, du lịch, công tác liên tỉnh? Đừng bỏ lỡ chương trình ưu đãi hấp dẫn nhất từ VeXeTienIch – tặng ngay voucher trị giá 80.000đ khi đặt vé online!",
    img: promotion1,
    information: [
      "Thông tin chương trình:",
      "Tên chương trình: TẶNG VOUCHER 80K – ĐẶT VÉ NGAY, ƯU ĐÃI LIỀN TAY!",
      "Thời gian áp dụng: Từ ngày 01/06/2025 đến hết ngày 30/06/2025",
      "Đối tượng áp dụng: Tất cả khách hàng đăng ký tài khoản trên hệ thống VeXeTienIch.vn và đặt vé lần đầu tiên trong thời gian diễn ra chương trình.",
      "Giá trị voucher: 80.000đ được trừ trực tiếp vào giá vé trong lần thanh toán đầu tiên.",
    ],
    condition: [
      "📌Điều kiện áp dụng:",
      "Áp dụng cho tất cả các tuyến xe có giá vé từ 300.000đ trở lên.",
      "Mỗi khách hàng chỉ được nhận 01 voucher 80K duy nhất trong suốt thời gian chương trình.",
      "	Voucher không có giá trị quy đổi thành tiền mặt và không áp dụng chung với các mã khuyến mãi khác.",
      "Ưu đãi chỉ áp dụng khi đặt vé qua website VeXeTienIch. hoặc ứng dụng di động chính thức",
    ],
    reason: [
      "🚌 Lý do bạn nên đặt vé tại VeXeTienIch?",
      "✅ Hệ thống kết nối hơn 300 nhà xe uy tín trên toàn quốc.",
      "✅ Đặt vé nhanh – thanh toán tiện – giữ chỗ ngay trong 1 phút.",
      "✅ Hỗ trợ đổi trả vé linh hoạt theo chính sách từng nhà xe.",
      "✅ Dịch vụ chăm sóc khách hàng 24/7 qua hotline và chat trực tuyến."
    ],
    instruct: [
      "💬 Hướng dẫn nhận voucher:",
      "1.	Truy cập website: https://VeXeTienIch.com hoặc mở ứng dụng VeXeTienIch trên điện thoại.",
      "2.	Đăng ký tài khoản mới (nếu chưa có).",
      "3.	Chọn tuyến xe và ngày đi phù hợp.",
      "4.	Khi thanh toán, hệ thống sẽ tự động áp dụng Voucher 80K nếu bạn đủ điều kiện.",
      "5.	Xác nhận đơn hàng – hoàn tất thanh toán và nhận vé điện tử.",
    ],
    contact: [
      "Nếu bạn gặp bất kỳ khó khăn nào khi đặt vé hoặc cần được hỗ trợ, đừng ngần ngại liên hệ ngay với chúng tôi:",
      "📞Hotline: 1900.9090 (hoạt động từ 7:00 – 22:00 hàng ngày)",
      "🌐Email: hotro@vexetienich.vn",
      "📢Fanpage: facebook.com/VeXeTienIch",
    ]

  },
  {
    title: "🔥 KHUYẾN MÃI HẤP DẪN – GIẢM NGAY 50% TỐI ĐA 50.000Đ CHO ĐƠN ĐẶT VÉ ĐẦU TIÊN! 🚌",
    description: "Bạn đang tìm kiếm một giải pháp tiết kiệm cho những chuyến đi liên tỉnh? VeXeTienIch gửi đến bạn chương trình khuyến mãi cực HOT trong tháng này – giảm 50% tối đa 50.000đ khi đặt vé lần đầu qua hệ thống!",
    img: promotion2,
    information: [
      "Thông tin chương trình:",
      "Tên ưu đãi: GIẢM 50% TỐI ĐA 50K CHO KHÁCH MỚI",
      "Thời gian áp dụng: Từ 15/05/2025 đến hết 30/06/2025",
      "Phạm vi áp dụng: Tất cả các tuyến xe liên tỉnh trên hệ thống VeXeTienIch.com hoặc ứng dụng VeXeTienIch.",
      "Hình thức ưu đãi: Giảm 50% giá vé, lên đến tối đa 50.000đ, khi khách hàng thanh toán lần đầu tiên trên nền tảng.",
    ],
    condition: [
      "📌Điều kiện áp dụng:",
      "Áp dụng duy nhất 01 lần cho mỗi tài khoản mới đăng ký và đặt vé đầu tiên.",
      "Không áp dụng kèm các chương trình giảm giá hoặc mã khuyến mãi khác.",
      "Mức giảm tối đa: 50.000đ – tức là nếu vé có giá 100.000đ thì bạn chỉ cần thanh toán 50.000đ!",
      "Mỗi giao dịch chỉ áp dụng 01 mã ưu đãi.",
    ],
    reason: [
      "🚌 Lý do bạn nên đặt vé tại VeXeTienIch?",
      "✅ Hệ thống kết nối hơn 300 nhà xe uy tín trên toàn quốc.",
      "✅ Đặt vé nhanh – thanh toán tiện – giữ chỗ ngay trong 1 phút.",
      "✅ Hỗ trợ đổi trả vé linh hoạt theo chính sách từng nhà xe.",
      "✅ Dịch vụ chăm sóc khách hàng 24/7 qua hotline và chat trực tuyến."
    ],
    instruct: [
      "💬 Hướng dẫn nhận voucher:",
      "1.	Truy cập website: https://VeXeTienIch.com hoặc mở ứng dụng VeXeTienIch trên điện thoại.",
      "2.	Đăng ký tài khoản mới (nếu chưa có).",
      "3.	Chọn tuyến xe và ngày đi phù hợp.",
      "4.	Khi thanh toán, hệ thống sẽ tự động áp dụng Voucher 80K nếu bạn đủ điều kiện.",
      "5.	Xác nhận đơn hàng – hoàn tất thanh toán và nhận vé điện tử.",
    ],
    contact: [
      "Nếu bạn gặp bất kỳ khó khăn nào khi đặt vé hoặc cần được hỗ trợ, đừng ngần ngại liên hệ ngay với chúng tôi:",
      "📞Hotline: 1900.9090 (hoạt động từ 7:00 – 22:00 hàng ngày)",
      "🌐Email: hotro@vexetienich.vn",
      "📢Fanpage: facebook.com/VeXeTienIch",
    ]

  },
  {
    title: "🎉 KHUYẾN MÃI ĐẶC BIỆT: GIẢM ĐẾN 50% CHO CÁC TUYẾN XE LIÊN TỈNH 🚌",
    description: "Bạn muốn tiết kiệm tối đa cho chuyến đi sắp tới? Hãy tận dụng ngay chương trình khuyến mãi đặc biệt từ VeXeTienIch với mức giảm giá lên đến 50% cho hàng loạt tuyến đường trên toàn quốc!",
    img: promotion3,
    information: [
      "Thông tin chương trình:",
      "Tên ưu đãi: GIẢM 50% TỐI ĐA 50K CHO KHÁCH MỚI",
      "Thời gian áp dụng: Từ 15/05/2025 đến hết 30/06/2025",
      "Phạm vi áp dụng: Tất cả các tuyến xe liên tỉnh trên hệ thống VeXeTienIch.com hoặc ứng dụng VeXeTienIch.",
      "Hình thức ưu đãi: Giảm 50% giá vé, lên đến tối đa 50.000đ, khi khách hàng thanh toán lần đầu tiên trên nền tảng.",
    ],
    condition: [
      "🧡 ƯU ĐÃI HẤP DẪN KÈM THEO – NHẬP MÃ “SUMMER30” GIẢM NGAY 30K",
      "Mã ưu đãi: SUMMER30",
      "Ưu đãi: Giảm trực tiếp 30.000đ",
      "Áp dụng cho: Tất cả khách hàng",
      "Giá trị đơn hàng tối thiểu: 100.000đ",
      "Thời gian áp dụng: Đến hết 30/06/2025",
    ],
    reason: [
      "🚌 Lý do bạn nên đặt vé tại VeXeTienIch?",
      "✅ Hệ thống kết nối hơn 300 nhà xe uy tín trên toàn quốc.",
      "✅ Đặt vé nhanh – thanh toán tiện – giữ chỗ ngay trong 1 phút.",
      "✅ Hỗ trợ đổi trả vé linh hoạt theo chính sách từng nhà xe.",
      "✅ Dịch vụ chăm sóc khách hàng 24/7 qua hotline và chat trực tuyến."
    ],
    instruct: [
      "💬 Hướng dẫn nhận voucher:",
      "1.	Truy cập website: https://VeXeTienIch.com hoặc mở ứng dụng VeXeTienIch trên điện thoại.",
      "2.	Đăng ký tài khoản mới (nếu chưa có).",
      "3.	Chọn tuyến xe và ngày đi phù hợp.",
      "4.	Khi thanh toán, hệ thống sẽ tự động áp dụng Voucher 80K nếu bạn đủ điều kiện.",
      "5.	Xác nhận đơn hàng – hoàn tất thanh toán và nhận vé điện tử.",
    ],
    contact: [
      "Nếu bạn gặp bất kỳ khó khăn nào khi đặt vé hoặc cần được hỗ trợ, đừng ngần ngại liên hệ ngay với chúng tôi:",
      "📞Hotline: 1900.9090 (hoạt động từ 7:00 – 22:00 hàng ngày)",
      "🌐Email: hotro@vexetienich.vn",
      "📢Fanpage: facebook.com/VeXeTienIch",
    ]

  },
   {
    title: "🎉 SUMMER SALE - KHUYẾN MÃI HÈ BÙNG NỔ CÙNG VEXETIENICH ☀️",
    description: "Mùa hè đã đến! Cùng VeXeTienIch du lịch thả ga mà không lo về giá! Ưu đãi giảm giá lên đến 50% dành cho tất cả khách hàng đặt vé xe trực tuyến trên hệ thống của chúng tôi.",
    img: promotion4,
    information: [
      "Thông tin chương trình:",
      "Tên ưu đãi: GIẢM 50% TỐI ĐA 50K CHO KHÁCH MỚI",
      "Thời gian áp dụng: Từ 15/05/2025 đến hết 30/06/2025",
      "Phạm vi áp dụng: Tất cả các tuyến xe liên tỉnh trên hệ thống VeXeTienIch.com hoặc ứng dụng VeXeTienIch.",
      "Hình thức ưu đãi: Giảm 50% giá vé, lên đến tối đa 50.000đ, khi khách hàng thanh toán lần đầu tiên trên nền tảng.",
    ],
    condition: [
      "🧡 ƯU ĐÃI HẤP DẪN KÈM THEO – NHẬP MÃ “SUMMER30” GIẢM NGAY 30K",
      "Mã ưu đãi: SUMMER30",
      "Ưu đãi: Giảm trực tiếp 30.000đ",
      "Áp dụng cho: Tất cả khách hàng",
      "Giá trị đơn hàng tối thiểu: 100.000đ",
      "Thời gian áp dụng: Đến hết 30/06/2025",
    ],
    reason: [
      "🚌 Lý do bạn nên đặt vé tại VeXeTienIch?",
      "✅ Hệ thống kết nối hơn 300 nhà xe uy tín trên toàn quốc.",
      "✅ Đặt vé nhanh – thanh toán tiện – giữ chỗ ngay trong 1 phút.",
      "✅ Hỗ trợ đổi trả vé linh hoạt theo chính sách từng nhà xe.",
      "✅ Dịch vụ chăm sóc khách hàng 24/7 qua hotline và chat trực tuyến."
    ],
    instruct: [
      "💬 Hướng dẫn nhận voucher:",
      "1.	Truy cập website: https://VeXeTienIch.com hoặc mở ứng dụng VeXeTienIch trên điện thoại.",
      "2.	Đăng ký tài khoản mới (nếu chưa có).",
      "3.	Chọn tuyến xe và ngày đi phù hợp.",
      "4.	Khi thanh toán, hệ thống sẽ tự động áp dụng Voucher 80K nếu bạn đủ điều kiện.",
      "5.	Xác nhận đơn hàng – hoàn tất thanh toán và nhận vé điện tử.",
    ],
    contact: [
      "Nếu bạn gặp bất kỳ khó khăn nào khi đặt vé hoặc cần được hỗ trợ, đừng ngần ngại liên hệ ngay với chúng tôi:",
      "📞Hotline: 1900.9090 (hoạt động từ 7:00 – 22:00 hàng ngày)",
      "🌐Email: hotro@vexetienich.vn",
      "📢Fanpage: facebook.com/VeXeTienIch",
    ]
  } 
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

  const handleClickPromotion = (promotion: object) => {
    
    navigation("/detail-promotion", { state: { promotion } })
  }

  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.title}>KHUYẾN MÃI NỔI BẬT</div>
      <Slider {...settings}>
        {promotions.map((promotion, index) => (
          <div key={index} className={styles.slide} onClick={() => handleClickPromotion(promotion)}>
            <img src={promotion?.img} alt={`Promotion ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PromotionSlider;
