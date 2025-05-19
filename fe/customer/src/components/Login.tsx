import React, { useState } from 'react';
import styles from "../styles/login.module.scss";
import { MdOutlineMail } from "react-icons/md";
import { MdOutlinePassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import Register from './Register';
import { LoginPayLoad } from '../types';
import { useUserStore } from '../store/userStore';
import { toast } from 'react-toastify';
import { loginUser } from "../services/auth.service";
import { useNavigate } from 'react-router';
import ForgotPassword from './ForgotPassword';

const Login: React.FC = () => {
  const navigate = useNavigate()
    const [login, setLogin] = useState(true);
    const [register, setRegister] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [dataLogin, setDataLogin] = useState<LoginPayLoad>({
      email: "",
      password: "",
    });
    const { setUser } = useUserStore();
  const onClickLogin = () => {
    setLogin(true)
    setRegister(false)
  }

  const onClickRegister = () => {
    setLogin(false)
    setRegister(true)
  }

  const onClickForgotPassword = () => {
    setForgotPassword(true)
    setLogin(false)
    setRegister(false)
  }
 const onClickBack = () => {
    setForgotPassword(false)
    setLogin(true)
    setRegister(false)
  }

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleLogin = async () => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(emailRegex.test(dataLogin?.email) === false) {
      toast.error("Email không đúng định dạng")
      return
    }

    const result = await loginUser(dataLogin);

    if (result.status === "OK" && result.data) {
      setUser({
        email: result?.data?.email,
        fullName: result?.data?.fullName,
        dateBirth: result?.data?.dateBirth,
        phone: result?.data?.phone,
        address: result?.data?.address,
        avatar: result?.data?.urlImg,
      });
      toast.success("Đăng nhập thành công");
      navigate("/")
      return;
    }else {
      toast.error("Đăng nhập thất bại");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1 className={styles.brand}>VÉ XE TIỆN ÍCH</h1>
        <p className={styles.slogan}>Cùng bạn trên mọi nẻo đường</p>
        <div className={styles.busImage}>
          <img src="https://cdn.futabus.vn/futa-busline-cms-dev/TVC_00aa29ba5b/TVC_00aa29ba5b.svg" alt="bus" />
        </div>
      </div>

      <div className={styles.right}>
        { 
          !forgotPassword ?
          <div className={styles.tabs}>
          <div className={`${styles.tab}  ${styles.active}`} onClick={onClickLogin}>ĐĂNG NHẬP</div>
          <div className={`${styles.tab} ${styles.active}`} onClick={onClickRegister}>ĐĂNG KÝ</div>
        </div>
        : <></>
        }
        <h2>Quên mật khẩu</h2>
        
        {
          forgotPassword ? 
           <ForgotPassword onButtonClick={onClickBack}/>
          :
          <>
            {
          login ?
            <div className={styles.contentLogin}>
            <div className={styles.inputGroup}>
          <MdOutlineMail className={styles.iconEmail} />
          <input
            type="tel"
            placeholder="Nhập email"
            className={styles.email}
            id="email"
            name="email"
            onChange={handleChangeValue}
          />
          <MdOutlinePassword className={styles.iconPassword} />
           <input
            type="password"
            placeholder="Nhập mật khẩu"
            className={styles.password}
            id="password"
            name="password"
            onChange={handleChangeValue}
          />
        </div>
        <button className={styles.button} onClick={handleLogin}>Đăng nhập</button>
        <div className={styles.forgotPassword} onClick={onClickForgotPassword}>Quên mật khẩu</div>
        </div>
          :
            <Register />
        }
          </>
          
        }
        
        
        
        
      </div>
    </div>
  );
};

export default Login;