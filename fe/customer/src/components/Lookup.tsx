import { useState } from "react";
import styles from "../styles/lookup.module.scss";
import { toast } from "react-toastify";
import { getDetailTicket } from "../services/ticket.service";
import { LookupTicketPayLoad } from "../types/ticket";
import moment from 'moment';

const Lookup = () => {
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
  const [lookup, setLookup] = useState({
    phone: "",
    idTicket: ""
  })
  
  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setLookup((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleSubmit = async () => {
      const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
      if(lookup.phone === "" || lookup.idTicket === "") {
        toast.error("Bạn nhập thiếu dữ liệu!")
        return
      }
      // if(!phoneRegex.test(lookup.phone)){
      //   toast.error("Số điện thoại k đúng định dạng!")
      //   return
      // }

      const res = await getDetailTicket(lookup)

      if(res && res.status === "OK") {
        const ticket = res.data
        const formattedTicket = {
          ...ticket,
          start_time: moment(ticket.start_time).utcOffset("+07:00").format("DD/MM/YYYY HH:mm"),
          end_time: moment(ticket.end_time).utcOffset("+07:00").format("DD/MM/YYYY HH:mm")
        };
        setDataTicket(formattedTicket)
      } else {
        toast.error("K có vé bạn tìm")
      }
    }

  return (
     <div className={styles.lookup}>
      <div className={styles.top}>
          <span>TRA CỨU THÔNG TIN ĐẶT VÉ</span>
          <input className={styles["text-phone"]} 
            type="text" 
            placeholder="Vui lòng nhập số điện thoại" 
            name="phone"
            id="phone"
            onChange={handleChangeValue}
            />
          <input className={styles["text-ticket"]} 
            type="text" 
            placeholder="Vui lòng nhập mã vé" 
            name="idTicket"
            id="idTicket"
            onChange={handleChangeValue}
            />
          <button className={styles["search-button"]}
            onClick={handleSubmit}
          >Tra cứu</button>
      </div>
      {dataTicket && dataTicket.email !== ""
        ?
          <div className={styles.bottom}>
            <h2>Thông tin vé</h2>
            <div className={styles.data}>
              <div className={styles.item}>
                <label>Email:</label>
                <span>{dataTicket?.email}</span>
              </div>
              <div className={styles.item}>
                <label>Tên người dùng:</label>
                <span>{dataTicket.user_name}</span>
              </div>
              <div className={styles.item}>
                <label>Thông tin chuyến xe:</label>
                <span>{dataTicket.trip_name}</span>
              </div>
              <div className={styles.item}>
                <label>Số ghế</label>
                <span>{dataTicket.seats}</span>
              </div>
              <div className={styles.item}>
                <label>Tổng tiền</label>
                <span className={styles.price}>{dataTicket.price}</span>
              </div>
              <div className={styles.item}>
                <label>Thời gian đi</label>
                <span className={styles.start}>{dataTicket.start_time}</span>
              </div>
              <div className={styles.item}>
                <label>Thời gian dự kiến</label>
                <span>{dataTicket.end_time}</span>
              </div>
              <div className={styles.item}>
                <label>Trạng thái thanh toán</label>
                <span>{dataTicket.payment_status}</span>
              </div>
            </div>
          </div>  
        :
        <></>
      }
      
      </div>

  );
};

export default Lookup;
