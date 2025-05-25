import { useLocation } from "react-router";
import styles from "../styles/detailTicket.module.scss";

const DetailTicket = () => {
    const location = useLocation();
    const ticket = location.state;  
    console.log("ticket: ", ticket);
    

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
                    <label>Số ghế:</label>
                    <span>{ticket.seats}</span>
                </div>
                <div className={styles.item}>
                    <label>Thời gian bắt đầu:</label>
                    <span>{ticket.start_time}</span>
                </div>
                <div className={styles.item}>
                    <label>Tổng tiền:</label>
                    <span>{ticket.price}</span>
                </div>
            </div>
        </div>
    );``
};

export default DetailTicket;
