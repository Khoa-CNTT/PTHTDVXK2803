import { MdOutlineMail } from "react-icons/md";
import styles from "../styles/forgotPassword.module.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { insetOtpForgotPassword } from "../services/customer.service";

interface ChildProps {
  onButtonClick: () => void;  
}

const ForgotPassword : React.FC<ChildProps>= ({onButtonClick}) => {
    const [email, setEmail] = useState("")
    const navigate = useNavigate()

    const handleChangeData =(e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handleSubmit = async () => {
        try {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(emailRegex.test(email) === false) {
              toast.error("Email không đúng định dạng")
              return
            }else {
                const res = await insetOtpForgotPassword(email)
                toast.success("Kiểm tra email để xác thực!")
                navigate("/verify-email-forgot-password",{state: {email: email}})
            }
        } catch (error) {
          console.log("err: ", error);
          
        }
    }
  return (
    <div className={styles.container}>
              <div className={styles.contentLogin}>
                <h2>Quên mật khẩu</h2>
                <div className={styles.inputGroup}>
          <MdOutlineMail className={styles.iconEmail} />
          <input
            type="tel"
            placeholder="Nhập email"
            className={styles.email}
            name="email"
            onChange={handleChangeData}
          />
        </div>
        </div>
        <button className={styles.buttonForgot} 
            onClick={handleSubmit}
        >Tiếp tục</button>
        <span className={styles.back} 
        onClick={onButtonClick}
        >Quay lại</span>
    </div>
  );
};

export default ForgotPassword;
