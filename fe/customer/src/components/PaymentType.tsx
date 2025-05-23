import { useState } from "react";
import CustomModal from "./CustomModal";
import QRPayment from "./QRPayment";
import styles from "../styles/paymentType.module.scss";
import { Radio, RadioChangeEvent } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingColumns, faWallet } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FormDataTicket } from "../pages/BookedPage";
import { cancelPaymentPayOS, createPayOsURL } from "../services/payment.service";
import { PayOSPaymentResponseData } from "../types/payos";

type PaymentType = "wallet" | "bank";

interface PaymentTypeProps {
  valueIn: FormDataTicket;
  onCloseModalPaymentType: (status: false) => void;
}

const PaymentType: React.FC<PaymentTypeProps> = ({ valueIn, onCloseModalPaymentType }) => {
  const [paymentType, setPaymentType] = useState<PaymentType>("wallet");
  const [isOpenQRPayment, setIsOpenQRPayment] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [dataPayment, setDataPayment] = useState<PayOSPaymentResponseData>();
  const { ticketId, user, seats, price } = valueIn;
  const navigate = useNavigate();
  const location = useLocation();

  const handleChangePaymentType = (e: RadioChangeEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const value = e.target.value;
    setPaymentType(value);
  };
  const handleCancelPayment = async () => {
    const response = await cancelPaymentPayOS({
      id: Number(dataPayment?.orderCode),
      reason: "Hủy thanh toán",
    });
    if (response.status === "OK") {
      setIsOpenQRPayment(false);
      onCloseModalPaymentType(false);
      navigate(`${location.pathname + location.search}`);
    }
  };

  const handleContinuePayment = async () => {
    if (!isChecked) {
      toast.warning("Bạn chưa đồng ý điều khoản của chúng tôi");
      return;
    } else {
      if (paymentType !== "bank") {
        toast.warning("Thanh toán này chưa sử dụng được, xin lỗi vì sự bất tiện này");
        return;
      } else {
        const responsePayment = await createPayOsURL({
          orderCode: ticketId,
          buyerEmail: user.email,
          buyerName: user.fullName,
          buyerPhone: user.phone,
          items: [{ name: `Thanh toán vé ${ticketId}`, quantity: 1, price: price }],
          description: `TT Ghe ${seats.map((s) => s.position).join(" ")}`,
          amount: price,
          returnUrl: "/",
          cancelUrl: "/",
        });
        setDataPayment(responsePayment);
        setIsOpenQRPayment(true);
      }
    }
  };

  const handlePaymentSuccess = () => {
    setIsOpenQRPayment(false);
    onCloseModalPaymentType(false);
  };

  return (
    <div className={styles["payment-type-wrapper"]}>
      <p className={styles.title}>Quý khách có thể chọn các loại thanh toán sau:</p>
      <Radio.Group
        className={styles["radio-group__payment-type"]}
        value={paymentType}
        onChange={handleChangePaymentType}
      >
        <Radio name="payment-type" value={"wallet"} className={styles.item}>
          <FontAwesomeIcon icon={faWallet} className={styles.ic} />
          Thẻ tín dụng
        </Radio>
        <Radio name="payment-type" value={"bank"} className={styles.item}>
          <FontAwesomeIcon icon={faBuildingColumns} className={styles.ic} />
          Chuyển khoản ngân hàng
        </Radio>
      </Radio.Group>
      <div className={styles.dash}></div>
      <div className={styles["condition-wrapper"]}>
        <input
          type="checkbox"
          name="condition"
          className={styles["condition-checkbox"]}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <div className={styles["condition-link-and-content"]}>
          <NavLink
            to={`${location.pathname + location.search}`}
            className={styles["condition-link-and-content__link"]}
          >
            Chấp nhận điều khoản
          </NavLink>
          <p className={styles["condition-link-and-content__content"]}>
            đặt vé & chính sách bảo mật của vé xe tiện ích
          </p>
        </div>
      </div>
      <button
        className={styles["continue-payment-btn"]}
        type="button"
        onClick={handleContinuePayment}
      >
        Thanh toán
      </button>
      <CustomModal
        onCancel={handleCancelPayment}
        open={isOpenQRPayment}
        title={"Thanh toán chuyển khoản qua ngân hàng"}
      >
        {dataPayment && <QRPayment valueIn={dataPayment} onPaymentSuccess={handlePaymentSuccess} />}
      </CustomModal>
    </div>
  );
};

export default PaymentType;
