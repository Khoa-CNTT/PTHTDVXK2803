import { useState } from "react";
import styles from "../styles/updatePassword.module.scss";
import { UpdateForgotPasswordPayLoad, UpdatePasswordPayLoad } from "../types";
import { updateNewPassword, updatePasswordCustomer } from "../services/customer.service";
import { useUserStore } from "../store/userStore";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";

const UpdateForgotPassword = () => {
    const navigation = useNavigate()
    const location = useLocation();
    const {email} = location.state

    const [dataUpdatePassword, setDataUpdatePassword] = useState<UpdateForgotPasswordPayLoad>({
        passwordNew: "",
        confirmPassword: ""
    });

    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataUpdatePassword((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

      const handleUpdatePassword = async () => {
        const {passwordNew, confirmPassword} = dataUpdatePassword

        if(!email  || !passwordNew || !confirmPassword) {
            toast.error("Bạn nhập thiếu dữ liệu");
            return
        }

        if(passwordNew !== confirmPassword) {
            toast.error("Xác nhận mật khẩu không thành công");
            return
        }

        const value = {email, passwordNew}
        const res = await updateNewPassword(value)

        console.log("update: ", res);
        
        if(res.status === "OK") {
            toast.success("Cập nhật mật khẩu thành công")
            setDataUpdatePassword({
                passwordNew: "",
                confirmPassword: ""
            })
            navigation("/login")
        }else {
            toast.error("Cập nhật mật khẩu thất bại")
        }
      }

  return (
    <div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.title}>
                Cập nhật mật khẩu
            </div>
            <div className={styles.form}>
                <div className={styles.item}>
                    <span>Mật khẩu mới</span>
                    <input
                    className={styles["input-password"]}
                    type="password"
                     name="passwordNew"
                    onChange={handleChangeValue}
                    />  
                </div>
                <div className={styles.item}>
                    <span>Xác nhận mật khẩu</span>
                    <input
                    className={styles["input-cf-password"]}
                    type="password"
                    name="confirmPassword"
                    onChange={handleChangeValue}
                />
                </div>
                <button className={styles.account__updateBtn} onClick={handleUpdatePassword}>Cập nhật</button>
            </div>
        </div>
    </div>
  );
};

export default UpdateForgotPassword;
