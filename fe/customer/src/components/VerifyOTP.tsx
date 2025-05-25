import React, { useEffect, useState } from 'react';
import styles from "../styles/verify-otp.module.scss";
import Header from './Header';
import { useLocation, useNavigate } from 'react-router-dom';
import OTPInput from './OtpInput';
import { veriFyEmail } from "../services/auth.service"
import { toast } from 'react-toastify';
import { useUserStore } from "../store/userStore";
import { sendOtp } from '../services/customer.service';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const [otpValue, setOtpValue] = useState({});

  const { email } = location.state

  const handleOTPVerify = async (data : { email: string; otp: string }) => {
    try {
      const response = await veriFyEmail(data);

      if ((response.status === "OK")) {
        const data = response.data;
        setUser({ email: data.email, fullName: data.fullName });
        setOtpValue({});
        toast.success("Đăng ký thành công");
        navigate("/")
        return;
      } else {
        return toast.error(response.message);
      }
    } catch (error) {
      console.log("err: ", error);
      
    }
    
}

  const handleSendOtp = async () => {
    try {
       const res = await sendOtp(email)
    
        if(res && res.status === "OK") {
          toast.success("Đã gửi lại mã, bạn hãy kiểm tra email!")
        }else {
          toast.error("Gửi mã thất bại!")
        }
    } catch (error) {
      console.log("err: ", error);
    }
  }

 return (
    <>
      <Header />
      <div className={styles.full}>
        <div className={styles["verify-otp-container"]}>
          <div className={styles.img}>
              <img
                  src='https://w7.pngwing.com/pngs/553/212/png-transparent-email-computer-icons-email-miscellaneous-blue-angle-thumbnail.png'
                  alt='Email_img'
                  id='verify-otp-img'
                  className={styles["verify-otp-img"]}
            />
            <div>
              <h3>Vui lòng kiểm tra email </h3>
              <p>Chúng tôi đã gửi mã xác nhận đến {email}</p>
            </div>
          </div>
          
          <OTPInput length={6} email={email} onsubmit={handleOTPVerify} />
          <div className={styles.footer}>
            <p>Không nhận được mã?</p>
            <p className={styles.underline} onClick={handleSendOtp}>Nhấn vào đây để nhận.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOTP;