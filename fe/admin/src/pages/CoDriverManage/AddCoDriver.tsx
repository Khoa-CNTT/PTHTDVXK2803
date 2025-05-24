import styles from "../../styles/addCD.module.scss";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import DefaultImage from "../../components/DefaultImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useCustomNavMutation } from "../../hooks/useCustomQuery";
import { addCoDriver } from "../../services/coDriver.service";
import { useQuery } from "@tanstack/react-query";
import { addLocation, deleteLocation, getAllLocation } from "../../services/location.service";
import InputDropDownListCD from "../../components/InputDropDownListCD";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";

const AddCoDriver = () => {
  const dateBirthRef = useRef<HTMLInputElement>(null);
  const [statePassword, setStatePassword] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [form, setForm] = useState({
    currentLocationId:0,
    fullName: "",
    phone: "",
    address: "",
    dateBirth: new Date().toISOString().split("T")[0],
    email: "",
    sex: "",
    password: "",
  });

  const { data: locationsData, isLoading: isLocationLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getAllLocation(),
    staleTime: 5 * 60 * 1000,
  });

  const addMutate = useCustomNavMutation(
    addCoDriver,
    "/co-driver-manage",
    "Thêm mới thành công",
    "Thêm mới thất bại"
  );

  const handleChangeValue = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prevForm) => {
      return {
        ...prevForm,
        [name]: value.toString(),
      };
    });
  };

  const handleSelectedLocation = (selectedArrival: string) => {
    const getId = locationsData && locationsData.filter((lo) => lo.name === selectedArrival)[0].id;
    setForm((prev) => ({ ...prev, currentLocationId: Number(getId) }));
  };

  const handleAddCoDriver = async () => {
    const formData = new FormData();

    if(!form.email || !form.phone || !form.password || !form.currentLocationId) {
      toast.error("Bạn điền thiếu thông tin")
    return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(emailRegex.test(form?.email) === false) {
      toast.error("Email không đúng định dạng")
      return
    }

    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
      if(!phoneRegex.test(form.phone)){
        toast.error("Số điện thoại k đúng định dạng!")
        return
      }


    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if(passwordRegex.test(form?.password) === false) {
      toast.error("Mật khẩu ít nhất phải 1 kí tự thường, hoa, đặc biệt và tối thiếu 8 kí tự")
      return
    }

    formData.append("data", JSON.stringify(form));
    if (image) {
      formData.append("file", image);
    }
    addMutate.mutate(formData);
  };

  const handleClickInputDate = () => {
    if (dateBirthRef.current) {
      dateBirthRef.current.showPicker();
    } else {
      return;
    }
  };

  const handleClickSelectedImg = (img: File) => {
    setImage(img);
  };

  const handleTogglePassword = () => {
    setStatePassword((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={styles["feats"]}>
        <Link to={`/co-driver-manage`} className={`${styles["btn-back"]} ${styles.btn}`}>
          Quay lại
        </Link>
        <button className={`${styles["btn-delete"]} ${styles.btn}`}>Xóa</button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddCoDriver();
        }}
        className={styles.form}
      >
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Thêm mới phụ xe</h2>
        </div>
        <ul className={styles["form-group-list"]}>
          <li className={styles["form-group-item"]}>
            <p className={styles.title}>Hình ảnh</p>
            <DefaultImage onSelectedImg={handleClickSelectedImg} />
          </li>
          {[
            { label: "Email", name: "email", type: "text" },
            { label: "Họ và tên", name: "fullName", type: "text" },
          ].map((item, index) => (
            <li key={index} className={styles["form-group-item"]}>
              <p className={styles.title}>{item.label}</p>
              <input
                name={item.name}
                type={item.type}
                className={styles["form-control"]}
                value={form[item.name as keyof typeof form]}
                onChange={handleChangeValue}
              />
            </li>
          ))}

          <li className={styles["form-group-item"]}>
            <p className={styles.title}>Giới tính</p>
            <select
              name="sex"
              className={styles["form-control"]}
              value={form.sex}
              onChange={handleChangeValue}
            >
              <option>--- Chọn Giới Tính ---</option>
              {["male", "female", "other"].map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </li>

          <li className={styles["form-group-item"]}>
            <p className={styles.title}>Thành phố đang làm vệc</p>
            {!isLocationLoading && locationsData ? (
              <InputDropDownListCD
                idHTML="location"
                titleModal={"Địa điểm"}
                list={locationsData.map((loc) => ({ id: loc.id, value: loc.name }))}
                contentPlaceholder="Nhập địa điểm"
                onSelected={handleSelectedLocation}
                funcAddItem={addLocation}
                funcDelItem={deleteLocation}
              />
            ) : (
              <Loading />
            )}
          </li>

          {[
            { label: "Ngày sinh", name: "dateBirth", type: "date" },
            { label: "Số điện thoại", name: "phone", type: "text" },
          ].map((item, index) => (
            <li key={index} className={styles["form-group-item"]}>
              <p className={styles.title}>{item.label}</p>
              <input
                ref={item.name === "dateBirth" ? dateBirthRef : null}
                onClick={item.name === "dateBirth" ? handleClickInputDate : undefined}
                name={item.name}
                type={item.type}
                className={styles["form-control"]}
                value={form[item.name as keyof typeof form]}
                onChange={handleChangeValue}
              />
            </li>
          ))}

          {/*  */}

          <li className={`${styles["form-group-item"]} ${styles["form-group-password"]}`}>
            <p className={styles.title}>Mật khẩu</p>
            <input
              name={"password"}
              type={statePassword ? "text" : "password"}
              className={styles["form-control"]}
              value={form.password}
              onChange={handleChangeValue}
            />
            <span className={styles["pass-status"]} onClick={handleTogglePassword}>
              {statePassword ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </span>
          </li>

          <li className={styles["form-group-item"]}>
            <p className={styles.title}>Địa chỉ</p>
            <textarea
              spellCheck={false}
              rows={3}
              name={"address"}
              className={`${styles["form-control"]} ${styles.textarea}`}
              value={form.address}
              onChange={handleChangeValue}
            />
          </li>

          <div className={styles["feat-add"]}>
            <button type="submit" className={styles["btn-add"]}>
              Thêm mới
            </button>
          </div>
        </ul>
      </form>
    </div>
  );
};

export default AddCoDriver;
