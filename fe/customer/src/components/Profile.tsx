import { useEffect, useState } from "react";
import styles from "../styles/profile.module.scss";
import { useUserStore } from "../store/userStore";
import { User } from "../types/user";
import { data, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { updateDetailUser, updateUserNoImage } from "../services/auth.service";
import moment from "moment";

const Profile = () => {
  const [avatar , setAvatar] = useState("https://randomuser.me/api/portraits/men/1.jpg")
  const { user, setUser } = useUserStore();
  const [fileAvatar, setFileAvatar] = useState<File | null>(null);
  const [dataUser, setDataUser] = useState<User>( {
    fullName: "",
        email: "",
       phone: "",
    avatar: "",
    dateBirth: "",
    sex: "male",
    address: ""
  })
  const navigate = useNavigate()

  useEffect(() => {
    if(user) {
      const formattedDate = moment(user?.dateBirth).format("YYYY-MM-DD");
      setDataUser({
        fullName: user?.fullName,
        email: user?.email,
        phone: user?.phone,
        dateBirth: formattedDate,
        sex: user?.sex,
        address: user?.address,
      })
    }else {
      navigate("/login")
    }
  }, [])

   const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDataUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

   const convertToBase64 = (file: File) => new Promise((resolve, reject) => {
      const reader = new FileReader()
  
      reader.readAsDataURL(file)
      reader.onload = () => {
        if(reader.result) {
          resolve(reader.result)
        }
      }
      reader.onerror = reject;
    })

   const handleOnchangeAvater = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
  if (!file) return;
  setFileAvatar(file); 
  const base64 = await convertToBase64(file);
  if (typeof base64 === "string") {
    setAvatar(base64); 
  }
    }

  const handleUpdateUser = async () => {
    try {
      if(fileAvatar) {
         if(user !== dataUser) {
          let formData = new FormData()
          formData.append("data", JSON.stringify(dataUser))
          formData.append("file", fileAvatar)
          
          let res = await updateDetailUser(formData)
          
          if(res && res.status === 'OK') {
            const formattedDate = moment(res?.user?.dateBirth).format("YYYY-MM-DD");
            const data = {
              ...res?.user,
              dateBirth: formattedDate
            }

            setAvatar(res?.user?.urlImg)
            setDataUser(data)
            setUser(res?.user)    
            toast.success("Bạn đã cập nhật thành công!")
          }else {
            toast.error("Cập nhật thất bại!")
          }
        }
      }else {
        let res = await updateUserNoImage(dataUser)
            console.log("res?.user: ", res);

        if(res && res.status === 'OK') {
            
            const formattedDate = moment(res?.user?.dateBirth).format("YYYY-MM-DD");
            const data = {
              ...res?.user,
              dateBirth: formattedDate
            }

            setDataUser(data)
            setUser(res?.user)    
            toast.success("Bạn đã cập nhật thành công!")
          }else {
            toast.error("Cập nhật thất bại!")
          }
      }
     
    
    } catch (error) {
      console.log("Lỗi: ", error);
      
    }
  }

  console.log("dataUser: ", dataUser);
  
  return (
    <div className={styles.container}>
      <div className={styles.account}>
      <h2 className={styles.account__title}>Thông tin tài khoản</h2>
      <p className={styles.account__subtitle}>
        Quản lý thông tin hồ sơ để bảo mật tài khoản
      </p>
      {
        dataUser ? 
           <div className={styles.account__card}>
        <div className={styles.account__avatar}>
          <img
            src={dataUser?.avatar ? dataUser?.avatar : avatar}
            alt="Avatar"
          />
          <input id="avatar" hidden type="file" 
              onChange={(e) => handleOnchangeAvater(e)}
          />
          <label htmlFor="avatar" className={styles.label}>Chọn ảnh</label>
          <p className={styles.account__note}>
            Dung lượng file tối đa 1 MB<br />Định dạng: .JPEG, .PNG
          </p>
        </div>

        <div className={styles.account__info}>
          <div className={styles.info__item}>
            <label>Email:</label>
            <input
              className={styles["input-email"]}
              type="text"
              placeholder="Email"
              value={dataUser?.email}
              onChange={handleChangeValue}
              disabled
              />
          </div>
          <div className={styles.info__item}>
            <label>Họ và tên:</label>
            <input
              className={styles["input-email"]}
              type="text"
              placeholder="Họ và tên"
              name="fullName"
               value={dataUser?.fullName}
              onChange={handleChangeValue}
              />
          </div>
          <div className={styles.info__item}>
            <label>Số điện thoại:</label>
            <input
              className={styles["input-email"]}
              type="text"
              placeholder="Điện thoại"
              name="phone"
              value={dataUser?.phone}
              onChange={handleChangeValue}
              />
          </div>
          <div className={styles.info__item}>
            <label>Giới tính:</label>
            <select name="sex" onChange={handleChangeValue}>
              <option value="">-- Chọn giới tính --</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div className={styles.info__item}>
            <label>Ngày sinh:</label>
            <input
              className={styles["input-date"]}
              type="date"
              name="dateBirth"
              value={dataUser?.dateBirth}
              onChange={handleChangeValue}
              />
          </div>
          <div className={styles.info__item}>
            <label>Địa chỉ:</label>
            <input
              className={styles["input-address"]}
              type="text"
              name="address"
              value={dataUser?.address}
              onChange={handleChangeValue}
              />
          </div>
          <button className={styles.account__updateBtn} onClick={handleUpdateUser}>Cập nhật</button>
        </div>
      </div>
        :
        <></>
      }
     
    </div>
    </div>
  );
};

export default Profile;
