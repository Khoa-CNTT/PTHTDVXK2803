import { useLocation, useNavigate } from "react-router";
import styles from "../styles/detailTicket.module.scss";

const DetailTicket = () => {
    const location = useLocation();
    const ticket = location.state;  
    const navigation= useNavigate()

    const handleClickBack = () => {
        navigation("/lich-su-dat-ve")
    }
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2>Chi tiết đặt vé</h2>
                <div className={styles.item}>
                    <label>Email:</label>
                    <span>{ticket.email}</span>
                </div>
                <div className={styles.item}>
                    <label>Họ và tên:</label>
                    <span>{ticket.user_name}</span>
                </div>
                <div className={styles.item}>
                    <label>Tên chuyến xe:</label>
                    <span>{ticket.trip_name}</span>
                </div>
                <div className={styles.item}>
                    <label>Thông tin xe:</label>
                    <span>{ticket?.type} - {ticket?.license_plate}</span>
                </div>
                <div className={styles.item}>
                    <label>Thông tin tài xế:</label>
                    <span>{ticket?.driver_name} - {ticket?.driver_phone}</span>
                </div>
                <div className={styles.item}>
                    <label>Số ghế:</label>
                    <span>{ticket.seats}</span>
                </div>
                <div className={styles.item}>
                    <label>Thời gian bắt đầu:</label>
                    <span>{ticket.start_time}</span>
                </div>
                <div className={styles.item}>
                    <label>Tổng tiền:</label>
                    <span className={styles.price}>{ticket.price}</span>
                </div>
                <div className={styles.item}>
                    <label>Trạng thái thanh toán:</label>
                    <span>{ticket.payment_status}</span>
                </div>
                <button onClick={handleClickBack}>Quay lại</button>
            </div>
        </div>
    );``
};

export default DetailTicket;
