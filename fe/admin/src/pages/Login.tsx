import { useState } from "react";
import { login } from "../services/auth.service";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import styled from "../styles/login.module.scss";
import { FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await login(form);
    console.log("res: ", response);
    
    if (response.status === "OK") {
      toast.success("Đăng nhập thành công");
      localStorage.setItem("accept", response.status);
      localStorage.setItem("expirationTime", response.expirationTime);
      navigate("/");
    } else {
      toast.error("Đăng nhập thất bại");
    }
  };

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleClickShowPassword= () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={styled["login-container"]}>
       <div className={styled.left}>
        <h1 className={styled.brand}>VÉ XE TIỆN ÍCH</h1>
        <p className={styled.slogan}>Cùng bạn trên mọi nẻo đường</p>
        <div className={styled.busImage}>
          <img src="https://cdn.futabus.vn/futa-busline-cms-dev/TVC_00aa29ba5b/TVC_00aa29ba5b.svg" alt="bus" />
        </div>
      </div>
      <form onSubmit={handleLogin} className={styled.form}>
        <h2>Đăng nhập</h2>
        <div className={styled.inputGroup}>
          <div className={styled.email}>
          <input
            type="text"
            placeholder="Nhập email"
            id="email"
            name="email"
            value={form.email}
            onChange={(e) => handleChangeValue(e)}
          />
        </div>
          <div className={styled.password}>
          <input
            placeholder="Nhập mật khẩu"
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={form.password}
            onChange={(e) => handleChangeValue(e)}
          />
           <FaEyeSlash className={styled.iconShowPassword}
            onClick={handleClickShowPassword}
          />
        </div>
        
        
        </div>
        <div className="action">
          <button type="submit" className={styled.buttonSubmit} onClick={handleLogin}>
            Đăng nhập
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
