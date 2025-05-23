import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/qRPayment.module.scss";
import { PayOSPaymentResponseData } from "../types/payos";
import { formatCurrency } from "../utils/formatCurrency";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { QRCode } from "antd";
import { useUserStore } from "../store/userStore";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";

interface QRPaymentProps {
  valueIn: PayOSPaymentResponseData;
  onPaymentSuccess: (status: false) => void;
}

const QRPayment: React.FC<QRPaymentProps> = ({ valueIn, onPaymentSuccess }) => {
  const userId = useUserStore((state) => state.user?.id);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    socket.current = io(`https://${import.meta.env.VITE_API_URL}.ngrok-free.app`, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.current.on("connect", () => {
      console.log("Socket connected with id", socket.current?.id);
      socket.current?.emit("register_user", userId);
    });

    socket.current.on("user_registered", (data) => {
      console.log("User registered successfully", data);
    });

    socket.current.on("custom_error", (error) => {
      console.error("Socket error", error);
    });

    socket.current.on("payment-status", (data) => {
      console.log("Payment status received", data);
      if (data.status === "success") {
        toast.success("Thanh toán thành công");
        onPaymentSuccess(false);
      }
    });

    socket.current.on("disconnect", (reason) => {
      console.log("Socket disconnected", reason);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [userId]);

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
