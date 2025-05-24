import { useEffect, useState } from "react";
import styles from "../styles/historyBookTicket.module.scss";
import { getDetailTicketByEmail } from "../services/ticket.service";
import { useUserStore } from "../store/userStore";
import { LookupTicketPayLoad, TicketPayLoad } from "../types/ticket";
import moment from "moment";

const HistoryBookTicket = () => {
  const { user } = useUserStore();
  const [dataTicket, setDataTicket] = useState<TicketPayLoad[]>([]);

  useEffect(() => {
    handleCallData();
  }, []);

  const handleCallData = async () => {
    try {
      
      if (user?.email) {
        const res = await getDetailTicketByEmail(user?.email);

        if (res && res.status === "OK") {
          const ticket = res.data;
          const formattedTicket = {
            ...ticket,
            start_time: moment(ticket.start_time).utcOffset("+07:00").format("DD/MM/YYYY HH:mm"),
            end_time: moment(ticket.end_time).utcOffset("+07:00").format("DD/MM/YYYY HH:mm"),
          };
          setDataTicket(formattedTicket);
        }
      }
    } catch (error) {
      console.log("catch: ", error);
    }
  };

  return (
    <div className={styles.container}>
      {dataTicket && dataTicket.length > 0 ? (
        <div className={styles.content}>
          <h2>Lịch sử đặt vé</h2>
          <div className={styles.data}>
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Họ và tên</th>
                  <th>Số Ghế</th>
                  <th>Thời gian đi</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                 {dataTicket.map((ticket, index) => (
                  <tr key={index}>
                    <td>{ticket?.email}</td>
                    <td>{ticket?.user_name}</td>
                    <td>{ticket?.seats}</td>
                    <td>{ticket?.start_time}</td>
                    <td>{ticket?.price}</td>
                    <td>{ticket?.payment_status}</td>
                    <td>Xem chi tiết</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>Đặt vé xe cùng VEXETIENICH</div>
      )}
    </div>
  );
};

export default HistoryBookTicket;
