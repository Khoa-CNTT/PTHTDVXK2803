import { useState } from "react";
import { login } from "../services/user.service";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await login(form);
    localStorage.setItem("accept", response.status);
    localStorage.setItem("expirationTime", response.expirationTime);
  };

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <div>
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
