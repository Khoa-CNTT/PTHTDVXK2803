import React, { useEffect, useState } from "react";
import styles from "../styles/login.module.scss";
import { MdOutlineMail, MdOutlinePassword } from "react-icons/md";
import { FaEyeSlash } from "react-icons/fa";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import { LoginPayLoad } from "../types";
import { useUserStore } from "../store/userStore";
import { toast } from "react-toastify";
import { loginUser } from "../services/auth.service";
import { useNavigate, useLocation } from "react-router";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUserStore();

  const [tabState, setTabState] = useState<"login" | "register" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [dataLogin, setDataLogin] = useState<LoginPayLoad>({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (location.pathname === "/login") {
      setTabState("login");
    } else if (location.pathname === "/register") {
      setTabState("register");
    }
  }, [location]);

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dataLogin.email)) {
      toast.error("Email không đúng định dạng");
      return;
    }

    const result = await loginUser(dataLogin);

    if (result?.status === "OK" && result.data) {
      localStorage.setItem("accept", result.status);
      localStorage.setItem("expirationTime", result.expirationTime);
      setUser({
        id: result.data.id,
        email: result.data.email,
        fullName: result.data.fullName,
        dateBirth: result.data.dateBirth,
        phone: result.data.phone,
        address: result.data.address,
        avatar: result.data.urlImg,
      });
      toast.success("Đăng nhập thành công");
      navigate("/");
      return
    }
    
    if(result?.message === false) {
      toast.error(result.message);
    } else {
      toast.error("Đăng nhập thất bại");
    }
  };

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1 className={styles.brand}>VÉ XE TIỆN ÍCH</h1>
        <p className={styles.slogan}>Cùng bạn trên mọi nẻo đường</p>
        <div className={styles.busImage}>
          <img
            src="https://cdn.futabus.vn/futa-busline-cms-dev/TVC_00aa29ba5b/TVC_00aa29ba5b.svg"
            alt="bus"
          />
        </div>
      </div>

      <div className={styles.right}>
        {tabState !== "forgot" && (
          <div className={styles.tabs}>
            <div
              className={`${styles.tab} ${tabState === "login" ? styles.active : ""}`}
              onClick={() => {
                setTabState("login");
                navigate("/login");
              }}
            >
              ĐĂNG NHẬP
            </div>
            <div
              className={`${styles.tab} ${tabState === "register" ? styles.active : ""}`}
              onClick={() => {
                setTabState("register");
                navigate("/register");
              }}
            >
              ĐĂNG KÝ
            </div>
          </div>
        )}

        {tabState === "forgot" ? (
          <ForgotPassword onButtonClick={() => setTabState("login")} />
        ) : tabState === "login" ? (
          <div className={styles.contentLogin}>
            <h2>Đăng nhập</h2>
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
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className={styles.password}
                id="password"
                name="password"
                onChange={handleChangeValue}
              />
              <FaEyeSlash className={styles.iconShowPassword} onClick={handleShowPassword} />
            </div>
            <button className={styles.button} onClick={handleLogin}>
              Đăng nhập
            </button>
            <div className={styles.forgotPassword} onClick={() => setTabState("forgot")}>
              Quên mật khẩu
            </div>
          </div>
        ) : (
          <Register />
        )}
      </div>
    </div>
  );
};

export default Login;
