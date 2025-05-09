import { useState } from "react";
import { login } from "../services/auth.service";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import styled from "../styles/login.module.scss";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await login(form);
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

  return (
    <div className={styled["login-container"]}>
      <form onSubmit={handleLogin}>
        <div className="ul">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={form.email}
            onChange={(e) => handleChangeValue(e)}
          />
        </div>
        <div className="ul">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={(e) => handleChangeValue(e)}
          />
        </div>
        <div className="action">
          <button type="submit" className="btn-login">
            Đăng nhập
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
