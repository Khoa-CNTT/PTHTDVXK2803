import React, { useState } from 'react';
import styles from "../styles/login.module.scss";
import { MdOutlineMail } from "react-icons/md";
import { MdOutlinePassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import Register from './Register';

const Login: React.FC = () => {
    const [login, setLogin] = useState(true);
    const [register, setRegister] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
  
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
            <>
              <div className={styles.contentLogin}>
                <div className={styles.inputGroup}>
          <MdOutlineMail className={styles.iconEmail} />
          <input
            type="tel"
            placeholder="Nhập email"
            className={styles.email}
          />
        </div>
        </div>
        <button className={styles.buttonForgot}>Tiếp tục</button>
        <span className={styles.back} onClick={onClickBack}>Quay lại</span>
            </>
          :
          <>
            {
          login ?
            <div className={styles.contentLogin}>
            <div className={styles.inputGroup}>
          <MdOutlineMail className={styles.iconEmail} />
          <input
            type="tel"
            placeholder="Nhập số điện thoại"
            className={styles.email}
          />
          <MdOutlinePassword className={styles.iconPassword} />
           <input
            type="password"
            placeholder="Nhập mật khẩu"
            className={styles.password}
          />
        </div>
        <button className={styles.button}>Tiếp tục</button>
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