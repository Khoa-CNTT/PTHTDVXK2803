import { useEffect, useState } from "react";
import styles from "../styles/historyBookTicket.module.scss";
import { getDetailTicketByEmail } from "../services/ticket.service";
import { useUserStore } from "../store/userStore";
import { LookupTicketPayLoad } from "../types/ticket";
import moment from "moment";

const HistoryBookTicket = () => {
  const { user} = useUserStore()
  const [dataTicket, setDataTicket] = useState<LookupTicketPayLoad>({
    email: "",
    user_name: "",
    seats: "",
    trip_name: "",
    price: "",
    start_time: "",
    end_time: "",
    payment_status: "",
  })

  useEffect(() => {
    handleCallData()
  }, [])

  const handleCallData = async () => {
    try {
      if(user?.email) {
      const res = await getDetailTicketByEmail(user?.email)
      console.log("Res: ", res);
      
      if(res && res.status === "OK") {
        const ticket = res.data
        const formattedTicket = {
          ...ticket,
          start_time: moment(ticket.start_time).utcOffset("+07:00").format("DD/MM/YYYY HH:mm"),
          end_time: moment(ticket.end_time).utcOffset("+07:00").format("DD/MM/YYYY HH:mm")
        };
      setDataTicket(formattedTicket)
      }
      }
    } catch (error) {
      console.log("catch: ", error);
      
    }
    
  }

  return (
    <div className={styles.container}>
      {
        dataTicket && dataTicket.email !== ""
        ?
           <div className={styles.content}> 
              <h2>Lịch sử đặt vé</h2>
              <div className={styles.data}>
                  <table>
                      <thead>
                          <tr>
                              <th>Email</th>
                              <th>Họ và tên</th>
                              <th>Số Vé</th>
                              <th>Thời gian</th>
                              <th>Điểm đi - Điểm đến</th>
                              <th>Trạng thái</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>Email</td>
                              <td>ọ và tên</td>
                              <td>Số Vé</td>
                              <td>Số Vé</td>
                              <td>Số Vé</td>
                              <td>Số Vé</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
            </div>
        :
        <div>
          Đặt vé xe cùng VEXETIENICH
        </div>
      }
     
    </div>
  );
};

export default HistoryBookTicket;
