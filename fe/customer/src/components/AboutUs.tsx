import styles from "../styles/aboutUs.module.scss";

const AboutUs = () => {
  return (
    <div className={styles.aboutSection}>
          <div className={styles.block}>
            <h2 className={styles.heading}>VÉ XE TIỆN ÍCH</h2>
            <h3 className={styles.slogan}>"Chất lượng là danh dự"</h3>
            <p>
              VÉ XE TIỆN ÍCH là nền tảng đặt vé xe trực tuyến hiện đại, giúp hành khách dễ dàng tìm kiếm, so sánh và mua vé xe chất lượng cao chỉ với vài thao tác đơn giản. Chúng tôi ra đời với sứ mệnh đưa công nghệ vào ngành vận tải hành khách, mang lại trải nghiệm đặt vé nhanh chóng – an toàn – minh bạch.

              Với hệ thống kết nối hàng trăm nhà xe uy tín trên toàn quốc, VÉ XE TIỆN ÍCH không chỉ cung cấp nhiều lựa chọn về tuyến đường, giờ chạy và giá vé, mà còn hỗ trợ người dùng trong việc theo dõi hành trình, nhận thông báo chuyến đi và chăm sóc sau bán hàng tận tâm.
            </p>
            <p>
              Chúng tôi không ngừng cải tiến để trở thành người bạn đồng hành đáng tin cậy của mọi hành khách trên hành trình khám phá mọi miền đất nước.
            </p>
          </div>

          <div className={styles.imageContainer}>
            <img src={"https://cdn.futabus.vn/futa-busline-web-cms-prod/anh_png_01_34151d7558/anh_png_01_34151d7558.png"} alt="VEXETIENICH" />
             <div className={styles.block}>
              <h2 className={styles.heading}>VEXETIENICH</h2>
            <p>
              Tuân thủ phương châm “Chất lượng là danh dự” VEXETIENICH hiện đang khai thác hơn 350 phòng vé, trạm trung chuyển trên khắp cả nước, đội ngũ nhân sự vận hành lên đến 12.000 nhân viên. Chúng tôi sở hữu 6.500 đầu xe các loại, trong đó có 2.500 xe giường nằm cao cấp, vận hành 150 tuyến xe liên tỉnh với 6.500 chuyến mỗi 
            </p>
            </div>
          </div>
          <div className={styles.imageContainer}>
             <div className={styles.block}>
              <h2 className={styles.heading}>ADVERTISING</h2>
            <p>
              Bên cạnh đó, chúng tôi còn đầu tư vào lĩnh vực truyền thông, quảng cáo với việc thành lập Công ty Cổ phần Quảng Cáo VEXETIENICH Việt Nam, là đơn vị khai thác quảng cáo trên toàn bộ hệ sinh thái của Tập Đoàn VEXETIENICH Group với đa dạng hình thức quảng cáo như Quảng cáo xe tuyến đường dài, Quảng cáo vận chuyển hàng, Quảng cáo xe taxi, gian hàng bán hàng… Trong xu hướng 4.0 hiện nay, chúng tôi cũng đang ứng dụng và phát triển những công nghệ quảng cáo kỹ thuật số (Digital Marketing) với mục tiêu mang đến giải pháp tiếp thị toàn diện hiệu quả cho doanh nghiệp.
            </p>
            </div>
            <img src={"https://cdn.futabus.vn/futa-busline-cms-dev/Futa_Ads_daceccbca8/Futa_Ads_daceccbca8.jpg"} alt="VEXETIENICH" />
          </div>
         
        </div>
  );
};

export default AboutUs;
