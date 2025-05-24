import styles from "../../styles/updateCD.module.scss";
import { Link } from "react-router-dom";
import { dateTimeTransform } from "../../utils/transform";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import DefaultImage from "../../components/DefaultImage";
import { useCustomNavMutation } from "../../hooks/useCustomQuery";
import { fetchDriver, updateInfoDriver } from "../../services/driver.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { addLocation, deleteLocation, getAllLocation } from "../../services/location.service";
import InputDropDownListCD from "../../components/InputDropDownListCD";
import { toast } from "react-toastify";

const UpdateDriver = () => {
  const { id } = useParams<{ id: string }>();
  const idFetch = id ?? "0";
  const dateBirthRef = useRef<HTMLInputElement>(null);
  const experienceYearRef = useRef<HTMLInputElement>(null);
  const [statePassword, setStatePassword] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["driver", idFetch],
    queryFn: () => fetchDriver(idFetch),
    staleTime: 5 * 60 * 1000,
  });

  const { data: locationsData, isLoading: isLocationLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getAllLocation(),
    staleTime: 5 * 60 * 1000,
  });

  const driver = data ?? null;

  const [form, setForm] = useState({
    id: id,
    fullName: "",
    phone: "",
    address: "",
    dateBirth: "",
    email: "",
    sex: "",
    password: "",
    experienceYears: "",
    licenseNumber: "",
    currentLocationId: 0,
  });

  const updateMutate = useCustomNavMutation(
    updateInfoDriver,
    "/driver-manage",
    "Cập nhật thông tin tài xế thành công",
    "Cập nhật thông tin tài xế thất bại"
  );

  const handleChangeValue = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((prevForm) => {
      return {
        ...prevForm,
        [name]: value,
      };
    });
  };

  const handleUpdateDriver = async () => {
    const { id, ...data } = form;

    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if(!phoneRegex.test(data.phone)){
      toast.error("Số điện thoại k đúng định dạng!")
      return
    }

    if (id) {
      await updateMutate.mutateAsync({ id: Number(id), data });
    } else {
      return;
    }
  };

  const handleClickInputDate = () => {
    if (dateBirthRef.current) {
      dateBirthRef.current.showPicker();
    } else {
      return;
    }
  };

  const handleClickInputExperienceYears = () => {
    if (experienceYearRef.current) {
      experienceYearRef.current.showPicker();
    } else {
      return;
    }
  };

  const handleTogglePassword = () => {
    setStatePassword((prev) => !prev);
  };

  const handleSelectedLocation = (selectedArrival: string) => {
    const getId = locationsData?.filter((lo) => lo.name === selectedArrival)[0].id;
    setForm((prev) => ({ ...prev, currentLocationId: Number(getId) }));
  };

  useEffect(() => {
    if (driver) {
      setForm({
        id: id,
        fullName: driver?.fullName ?? "",
        password: "",
        sex: driver?.sex ?? "",
        licenseNumber: driver?.licenseNumber ?? "",
        experienceYears: driver?.experienceYears?.split("T")[0] ?? "",
        phone: driver?.phone ?? "",
        address: driver?.address ?? "",
        dateBirth: driver?.dateBirth?.split("T")[0] ?? "",
        email: driver?.email ?? "",
        currentLocationId: driver?.currentLocationId || 0,
      });
    }
  }, [driver]);

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;
  if (!driver) return <p className={styles.error}>Không tìm thấy thông tin khách hàng</p>;

  return (
    <div className={styles.container}>
      <div className={styles["feats"]}>
        <Link to={`/driver-manage`} className={`${styles["btn-back"]} ${styles.btn}`}>
          Quay lại
        </Link>
        <button className={`${styles["btn-delete"]} ${styles.btn}`}>Xóa</button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateDriver();
        }}
        className={styles.update}
      >
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Thông tin cập nhật</h2>
        </div>
        <ul className={styles["data-list"]}>
          <li className={styles.item}>
            <p className={styles.title}>Hình ảnh</p>
            <DefaultImage
              src={driver.urlImg}
              id={Number(idFetch)}
              updateType={"driver"}
              publicId={driver.urlPublicImg}
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Email</p>
            <input type="text" className={styles.data} value={driver.email} readOnly />
          </li>

          <li className={styles.item}>
            <p className={styles.title}>Họ và tên</p>
            <input
              type="text"
              className={styles.data}
              name="fullName"
              value={driver.fullName}
              onChange={handleChangeValue}
            />
          </li>

          <li className={styles.item}>
            <p className={styles.title}>Giới tính</p>
            <select
              name="sex"
              className={styles.data}
              value={form.sex}
              onChange={handleChangeValue}
            >
              <option value="">--- Chọn Giới Tính ---</option>
              {["male", "female", "other"].map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </li>

          <li className={styles.item}>
            <p className={styles.title}>Thành phố đang làm vệc</p>
            {!isLocationLoading ? (
              <InputDropDownListCD
                idHTML="location"
                titleModal={"Địa điểm"}
                valueIn={data?.location?.name}
                list={locationsData?.map((loc) => ({ id: loc.id, value: loc.name })) || []}
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
            <li key={index} className={styles.item}>
              <p className={styles.title}>{item.label}</p>
              <input
                ref={item.type === "date" ? dateBirthRef : null}
                onClick={item.type === "date" ? handleClickInputDate : undefined}
                name={item.name}
                type={item.type}
                className={styles.data}
                value={form[item.name as keyof typeof form]}
                onChange={handleChangeValue}
              />
            </li>
          ))}

          <li className={`${styles.item} ${styles["item-password"]}`}>
            <p className={styles.title}>Mật khẩu</p>
            <input
              name={"password"}
              type={statePassword ? "text" : "password"}
              className={styles.data}
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

          {[
            { label: "Mã Giấy phép lái xe", name: "licenseNumber", type: "text" },
            { label: "Ngày cấp", name: "experienceYears", type: "date" },
          ].map((item, index) => (
            <li key={index} className={styles.item}>
              <p className={styles.title}>{item.label}</p>
              <input
                ref={item.name === "experienceYears" ? experienceYearRef : null}
                onClick={
                  item.name === "experienceYears" ? handleClickInputExperienceYears : undefined
                }
                name={item.name}
                type={item.type}
                className={styles.data}
                value={form[item.name as keyof typeof form]}
                onChange={handleChangeValue}
              />
            </li>
          ))}

          <li className={styles.item}>
            <p className={styles.title}>Địa chỉ</p>
            <textarea
              spellCheck={false}
              rows={3}
              name="address"
              onChange={handleChangeValue}
              className={`${styles.data} ${styles.textarea}`}
              value={driver.address}
            />
          </li>

          {/* Trường chỉ đọc */}
          <li className={styles.item}>
            <p className={styles.title}>Ngày tạo</p>
            <input
              type="text"
              className={styles.data}
              value={dateTimeTransform(driver.createAt, "DD-MM-YYYY")}
              readOnly
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Ngày cập nhật</p>
            <input
              type="text"
              className={styles.data}
              value={dateTimeTransform(driver.updateAt, "DD-MM-YYYY")}
              readOnly
            />
          </li>

          <div className={styles["feat-update"]}>
            <button type="submit" className={styles["btn-update"]}>
              Cập Nhật
            </button>
          </div>
        </ul>
      </form>
    </div>
  );
};

export default UpdateDriver;
