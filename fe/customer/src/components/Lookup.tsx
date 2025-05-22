import { useState } from "react";
import styles from "../styles/lookup.module.scss";
import { toast } from "react-toastify";

const Lookup = () => {
  const [dataTicket, setDataTicket] = useState()
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

    const handleSubmit = () => {
      const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
      if(lookup.phone === "" || lookup.idTicket === "") {
        toast.error("Bạn nhập thiếu dữ liệu!")
        return
      }
      if(!phoneRegex.test(lookup.phone)){
        toast.error("Số điện thoại k đúng định dạng!")
        return
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
      <div className={styles.bottom}>
        <h2>Thông tin vé</h2>
        <div className={styles.data}>
          <div className={styles.item}>
            <label>Email:</label>
            <span>Email:</span>
          </div>
          <div className={styles.item}>
            <label>Tên người dùng:</label>
            <span>Email:</span>
          </div>
          <div className={styles.item}>
            <label>Thông tin vé:</label>
            <span>Email:</span>
          </div>
          <div className={styles.item}>
            <label>Thông tin xe:</label>
            <span>Email:</span>
          </div>
        </div>
      </div>  
      </div>

  );
};

export default Lookup;
