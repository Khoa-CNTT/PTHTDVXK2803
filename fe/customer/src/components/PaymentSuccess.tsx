import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/paymentSuccess.module.scss";
import { faCheck, faDownload, faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { QRCode } from "antd";
import { DataPaymentSuccess } from "../types/payment";
import React from "react";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";

interface PaymentSuccessProps {
  data: DataPaymentSuccess[];
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ data }) => {
  console.log("data", data);
  return (
    <>
      {data[0].paymentStatus === "paid" && (
        <div className={styles["payment-success-container"]}>
          <FontAwesomeIcon icon={faCheck} className={styles["ic-success"]} />
          <div className={`${styles.center}`}>
            <h2 className={styles.title}>Mua vé xe thành công</h2>
          </div>
          <div className={`${styles.center}`}>
            <p>
              VEXETIENICH đã gửi thông tin về địa chỉ email
              <strong className={`${styles["recei-email"]}`}>{data[0].email}</strong>
              Vui lòng kiểm tra lại
            </p>
          </div>
          <div className={styles["booked-ticket-info"]}>
            <div className={styles["booked-ticket-title"]}>
              <h3 className={styles.title}>Thông tin vé</h3>
            </div>
            <div className={styles["booked-ticket-body"]}>
              <div className={styles["ticket-info"]}>
                <div className={styles["ticket-info__user"]}>
                  <div className={styles["ticlet-info__user-detail"]}>
                    <label htmlFor="fullName" className={styles["ticket-info__user-detail-label"]}>
                      Họ và tên
                    </label>
                    <strong className={styles["ticket-info__user-detail-content"]} id="fullName">
                      {data[0].fullName}
                    </strong>
                  </div>
                  <div className={styles["ticlet-info__user-detail"]}>
                    <label htmlFor="phone" className={styles["ticket-info__user-detail-label"]}>
                      Số điện thoại
                    </label>
                    <strong className={styles["ticket-info__user-detail-content"]} id="phone">
                      {data[0].phone}
                    </strong>
                  </div>
                  <div className={styles["ticlet-info__user-detail"]}>
                    <label htmlFor="email" className={styles["ticket-info__user-detail-label"]}>
                      Email
                    </label>
                    <strong className={styles["ticket-info__user-detail-content"]} id="email">
                      {data[0].email}
                    </strong>
                  </div>
                </div>
                <div className={styles["ticket-info__payment"]}>
                  <div className={styles["ticket-info__payment-detail"]}>
                    <label
                      htmlFor="totalPrice"
                      className={styles["ticket-info__payment-detail-label"]}
                    >
                      Tổng giá vé
                    </label>
                    <strong
                      className={styles["ticket-info__payment-detail-content"]}
                      id="totalPrice"
                    >
                      {formatCurrency(data.reduce((sum, tk) => sum + Number(tk.price), 0))}
                    </strong>
                  </div>
                  <div className={styles["ticket-info__payment-detail"]}>
                    <label
                      htmlFor="paymenType"
                      className={styles["ticket-info__payment-detail-label"]}
                    >
                      PTTT
                    </label>
                    <strong
                      className={styles["ticket-info__payment-detail-content"]}
                      id="paymenType"
                    >
                      Banking
                    </strong>
                  </div>
                  <div className={styles["ticket-info__payment-detail"]}>
                    <label htmlFor="email" className={styles["ticket-info__payment-detail-label"]}>
                      Trạng thái
                    </label>
                    <strong className={styles["ticket-info__payment-detail-content"]} id="email">
                      Thanh toán thành công
                    </strong>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles["ticket-info__seats"]}>
              {data &&
                data.map((t, index) => (
                  <div key={`${t.id}-${index}`} className={styles["ticket-info__seat-item"]}>
                    <div className={styles["ticket-info__seat-item__actions"]}>
                      <FontAwesomeIcon icon={faDownload} className={styles.ic} />
                      <h3
                        className={styles["ticket-info__seat-item__actions-title"]}
                      >{`Mã vé ${t.id}${t.seatPosition}`}</h3>
                      <FontAwesomeIcon icon={faShareFromSquare} className={styles.ic} />
                    </div>
                    <div className={styles["ticket-info__seat-item__qr"]}>
                      <QRCode value={`${t.id}${t.seatPosition}`} />
                    </div>
                    <div className={styles["ticket-info__seat-item-info"]}>
                      <div className={styles["ticket-info__seat-item-info__detail"]}>
                        <p>Tuyến xe</p>
                        <p className={styles["ticket-info__seat-item-info__detail__content"]}>
                          {`${t.departure} - ${t.arrival}`}
                        </p>
                      </div>
                      <div className={styles["ticket-info__seat-item-info__detail"]}>
                        <p>Thời gian</p>
                        <p className={styles["ticket-info__seat-item-info__detail__content"]}>
                          {formatDate(t.startTime, "DD-MM-YYYY-HH:mm", false).split(" ")[0]}
                        </p>
                      </div>
                      <div className={styles["ticket-info__seat-item-info__detail"]}>
                        <p>Số ghế</p>
                        <p className={styles["ticket-info__seat-item-info__detail__content"]}>
                          {t.seatPosition}
                        </p>
                      </div>
                      <div className={styles["ticket-info__seat-item-info__detail"]}>
                        <p>Điểm lên xe</p>
                        <p className={styles["ticket-info__seat-item-info__detail__content"]}>
                          {`Bến xe ${t.departure}`}
                        </p>
                      </div>
                      <div className={styles["ticket-info__seat-item-info__detail"]}>
                        <p>Giá vé</p>
                        <p className={styles["ticket-info__seat-item-info__detail__content"]}>
                          {formatCurrency(t.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="actions">
              <button type="button" className={styles["actions__share"]}>
                <FontAwesomeIcon icon={faShareFromSquare} className={styles.ic} />
                Chia sẻ
              </button>
              <button type="button" className={styles["actions__download"]}>
                <FontAwesomeIcon icon={faDownload} className={styles.ic} />
                Tải xuống
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentSuccess;
