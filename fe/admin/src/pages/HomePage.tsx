import styles from "../styles/homePage.module.scss";

const HomePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>* Quy định sử dụng trang web</h2>
        <div className={styles.data}>
          <ul>
            <li>✅ Quản trị viên cần sử dụng hệ thống đúng mục đích: kiểm soát, giám sát và quản lý dữ liệu, không sử dụng cho mục đích cá nhân hoặc ngoài phạm vi cho phép.</li>
            <li>✅ Không chia sẻ tài khoản quản trị với người khác. Thường xuyên thay đổi mật khẩu và đăng xuất sau mỗi phiên làm việc.</li>
            <li>✅ Mọi thao tác chỉnh sửa hoặc xoá dữ liệu người dùng, vé xe, chuyến xe... cần được cân nhắc kỹ lưỡng. Nếu sai sót, bạn phải chịu trách nhiệm.</li>
            <li>✅ Dữ liệu nội bộ như thông tin khách hàng, doanh thu, chuyến xe... là tài liệu mật. Tuyệt đối không chia sẻ hoặc sao chép ra bên ngoài khi chưa được cấp phép.</li>
            <li>✅ Nếu muốn thử tính năng, cần dùng môi trường thử nghiệm (test/staging). Tuyệt đối không thử thao tác như huỷ vé, xoá tài khoản... trên hệ thống đang vận hành.</li>
            <li>✅ Mọi hành động của bạn đều được ghi lại trong nhật ký hệ thống (logs). Hãy đảm bảo bạn hiểu rõ chức năng trước khi thao tác</li>
            <li>✅ Nếu phát hiện lỗi hệ thống, thao tác bất thường hoặc nguy cơ bảo mật – hãy báo ngay cho bộ phận kỹ thuật.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
