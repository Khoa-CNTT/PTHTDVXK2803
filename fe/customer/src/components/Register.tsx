import { MdDriveFileRenameOutline, MdOutlineMail, MdOutlinePassword } from "react-icons/md";
import styles from "../styles/register.module.scss";
import { useState } from "react";
import { register } from "../services/customer.service";
import { RegisterPayLoad } from "../types";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { FaEyeSlash } from "react-icons/fa";

const Register = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [dataRegister, setDataRegister] = useState<RegisterPayLoad>({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  
  const handleClickShowPassword= () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword= () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(dataRegister?.email) === false) {
        toast.error("Email không đúng định dạng");
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (passwordRegex.test(dataRegister?.password) === false) {
        toast.error("Mật khẩu ít nhất phải 1 kí tự thường, hoa, đặc biệt và tối thiểu 8 kí tự");
        return;
      }

      if (dataRegister?.password !== dataRegister?.confirmPassword) {
        toast.error("Xác nhận mật khẩu không chính xác!");
        return;
      }

      const result = await register(dataRegister);

      if (result?.status === "OK") {
        toast.success("Xác thực email!");
        navigate("/verify-otp", {
          state: {
            email: dataRegister?.email
          }
        });
        return
      }
      if(result?.status === "E1") {
        toast.error(result?.message)
      } else {
        toast.error("Đăng ký thất b");
      }
    } catch (error) {
      console.error("Đã có lỗi xảy ra:", error);
      toast.error("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className={styles.contentRegister}>
      <h2 >Đăng ký</h2>
          <div className={styles.inputGroup}>
          <MdOutlineMail className={styles.iconEmail} />
          <input
            type="email"
            placeholder="Nhập email"
            name="email"
            className={styles.email}
            value={dataRegister?.email}
            onChange={handleChangeValue}
          />
          <MdDriveFileRenameOutline className={styles.iconName} />
          <input
            type="text"
            placeholder="Nhập họ và tên"
            name="fullName"
            className={styles.name}
             value={dataRegister?.fullName}
            onChange={handleChangeValue}
          />
          <MdOutlinePassword className={styles.iconPassword} />
           <input
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            name="password"
            className={styles.password}
            value={dataRegister?.password}
            onChange={handleChangeValue}
          />
          <FaEyeSlash className={styles.iconShowPassword}
            onClick={handleClickShowPassword}
          />
          <MdOutlinePassword className={styles.iconConfirmPassword} />
           <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Xác nhận mật khẩu"
            name="confirmPassword"
            className={styles.password}
            value={dataRegister?.confirmPassword}
            onChange={handleChangeValue}
          />
          <FaEyeSlash className={styles.iconShowConfirmPassword}
            onClick={handleClickShowConfirmPassword}
          />

        </div>
        <button type="button" className={styles.button} onClick={handleSubmit} >Đăng ký</button>
            </div>
  );
};

export default Register;
