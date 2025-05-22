import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/qRPayment.module.scss";
import { PayOSPaymentResponseData } from "../types/payos";
import { formatCurrency } from "../utils/formatCurrency";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { QRCode } from "antd";

interface QRPaymentProps {
  valueIn: PayOSPaymentResponseData;
}

const QRPayment: React.FC<QRPaymentProps> = ({ valueIn }) => {
  console.log("values", valueIn);

  return (
    <div className={styles["qr-payment-wrapper"]}>
      <p className={styles.title}>Tổng tiền thanh toán</p>
      <p className={styles.price}>{formatCurrency(valueIn.amount)}</p>
      <div className={styles["count-down"]}>
        <p>Thời gian còn lại còn</p>
        <p>5:00</p>
      </div>
      <QRCode className={styles.qr} value={valueIn.qrCode} />
      <div className={styles["info-bank"]}>
        <p>
          <strong>Tên tài khoản:</strong> {valueIn.accountName}
        </p>
        <p>
          <strong>Số tài khoản:</strong> {valueIn.accountNumber}
        </p>
      </div>
      <div className={styles["tutorial-payment"]}>
        <p className={styles["tutorial-payment__title"]}>
          Hướng dẫn thanh toán bằng ứng dụng ngân hàng
        </p>
        <div className={styles["tutorial-payment__list-step"]}>
          <p className={styles["tutorial-payment__list-step-item"]}>
            Mở ứng dụng ngân hàng trên điện thoại
          </p>
          <p className={styles["tutorial-payment__list-step-item"]}>
            Dùng biểu tượng <FontAwesomeIcon icon={faQrcode} /> để quét
          </p>
          <p className={styles["tutorial-payment__list-step-item"]}>
            Quét mã trên màn hình và thanh toán
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRPayment;
