import styles from "../../styles/updateCD.module.scss";
import { Link } from "react-router-dom";
import { dateTimeTransform } from "../../utils/transform";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCoDriver, updateInfoCoDriver } from "../../services/coDriver.service";
import Loading from "../../components/Loading";
import DefaultImage from "../../components/DefaultImage";
import { useCustomNavMutation } from "../../hooks/useCustomQuery";
import InputDropDownListCD from "../../components/InputDropDownListCD";
import { addLocation, deleteLocation, getAllLocation } from "../../services/location.service";
import { toast } from "react-toastify";

const UpdateCoDriver = () => {
  const { id } = useParams<{ id: string }>();
  const idFetch = id ?? "0";
  const dateBirthRef = useRef<HTMLInputElement>(null);

  const { data: coDriverData, isLoading, error } = useQuery({
    queryKey: ["coDriver", idFetch],
    queryFn: () => fetchCoDriver(idFetch),
    staleTime: 5 * 60 * 1000,
  });

  const { data: locationsData, isLoading: isLocationLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getAllLocation(),
    staleTime: 5 * 60 * 1000,
  });


  const [form, setForm] = useState({
    id: id,
    fullName: "",
    password: "",
    sex: "",
    phone: "",
    address: "",
    dateBirth: "",
    email: "",
    currentLocationId: 0,
  });

  const updateMutate = useCustomNavMutation(
    updateInfoCoDriver,
    "/co-driver-manage",
    "Cập nhật thông tin phụ xe thành công",
    "Cập nhật thông tin phụ xe thất bại"
  );

  useEffect(() => {
    if (coDriverData) {
      setForm({
        id: id,
        fullName: coDriverData?.fullName ?? "",
        password: "",
        sex: coDriverData?.sex ?? "",
        phone: coDriverData?.phone ?? "",
        address: coDriverData?.address ?? "",
        dateBirth:  coDriverData?.dateBirth?.split("T")[0] ?? "",
        email: coDriverData?.email ?? "",
        currentLocationId: coDriverData?.location?.id ?? 0,
      });
    }
  }, [coDriverData]);

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

  const handleUpdateCoDriver = async () => {
    const { id, ...data } = form;

    if(!data.currentLocationId || !data.sex || !data.phone || !data.password) {
      toast.error("Bạn điền thiếu dữ liệu!")
      return
    }

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

  const handleSelectedLocation = (selectedArrival: string) => {
    const getId =locationsData?.filter((lo) => lo.name === selectedArrival)[0].id;
    setForm((prev) => ({ ...prev, currentLocationId: Number(getId) }));
  };

  
  console.log('co-driver', coDriverData)
  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;
  if (!coDriverData) return <p className={styles.error}>Không tìm thấy thông tin khách hàng</p>;

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
          handleUpdateCoDriver();
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
              src={coDriverData.urlImg}
              id={Number(idFetch)}
              updateType={"co-driver"}
              publicId={coDriverData.urlPublicImg}
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Email</p>
            <input type="text" className={styles.data} value={coDriverData.email} readOnly />
          </li>

          <li className={styles.item}>
            <p className={styles.title}>Họ và tên</p>
            <input
              name="fullName"
              onChange={handleChangeValue}
              type="text"
              className={styles.data}
              value={coDriverData.fullName}
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
                valueIn={coDriverData.location.name}
                list={ locationsData?.map((loc) => ({ id: loc.id, value: loc.name })) || []}
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
            { label: "Mật khẩu", name: "password", type: "password" },
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

          <li className={styles.item}>
            <p className={styles.title}>Địa chỉ</p>
            <textarea
              spellCheck={false}
              rows={3}
              name="address"
              onChange={handleChangeValue}
              className={`${styles.data} ${styles.textarea}`}
              value={coDriverData.address}
              readOnly
            />
          </li>

          {/* Trường chỉ đọc */}
          <li className={styles.item}>
            <p className={styles.title}>Ngày tạo</p>
            <input
              type="text"
              className={styles.data}
              value={dateTimeTransform(coDriverData.createAt, "DD-MM-YYYY")}
              readOnly
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Ngày cập nhật</p>
            <input
              type="text"
              className={styles.data}
              value={dateTimeTransform(coDriverData.updateAt, "DD-MM-YYYY")}
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

export default UpdateCoDriver;
