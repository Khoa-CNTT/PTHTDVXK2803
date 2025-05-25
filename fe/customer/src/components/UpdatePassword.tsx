import { useState } from "react";
import styles from "../styles/updatePassword.module.scss";
import { UpdatePasswordPayLoad } from "../types";
import { updatePasswordCustomer } from "../services/customer.service";
import { useUserStore } from "../store/userStore";
import { toast } from "react-toastify";

const UpdatePassword = () => {
    const {user, setUser } = useUserStore();
    
    const [dataUpdatePassword, setDataUpdatePassword] = useState<UpdatePasswordPayLoad>({
        passwordOld: "",
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
        try {
            const {passwordOld, passwordNew, confirmPassword} = dataUpdatePassword

            if(!user?.email || !passwordOld || !passwordNew || !confirmPassword) {
                toast.error("Bạn nhập thiếu dữ liệu");
                return
            }

            if(passwordNew !== confirmPassword) {
                toast.error("Xác nhận mật khẩu không thành công");
                return
            }

            const email = user.email
            const value = {email, passwordOld, passwordNew}
            const res = await updatePasswordCustomer(value)
            
            
            if(res?.data?.status === "OK") {
                toast.success("Cập nhật mật khẩu thành công")
                setDataUpdatePassword({
                    passwordOld: "",
                    passwordNew: "",
                    confirmPassword: ""
                })
                return
            }else {
                toast.error("Cập nhật thất bại")
            }
            
           
        } catch (error) {
            console.log("err: ", error);
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
                    <span>Mật khẩu cũ</span>
                    <input
                    className={styles["input-email"]}
                    type="password"
                     name="passwordOld"
                    onChange={handleChangeValue}
                />
                </div>
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

export default UpdatePassword;
