import styles from "../../styles/addBus.module.scss";
import { addBus } from "../../services/bus.service";
import { Link } from "react-router-dom";
import ImageListCUD, { ImageCUDType } from "../../components/ImageListCUD";
import { useEffect, useState } from "react";
import { useCustomNavMutation } from "../../hooks/useCustomQuery";
import { addLocation, deleteLocation, getAllLocation } from "../../services/location.service";
import { useQuery } from "@tanstack/react-query";
import InputDropDownListCD from "../../components/InputDropDownListCD";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";

const AddBus = () => {
  const [images, setImages] = useState<ImageCUDType[]>([]);

  const [form, setForm] = useState({
    licensePlate: "",
    capacity: 0,
    type: "",
    indexIsMain: "",
  });

  const { data: locationsData, isLoading: isLocationLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getAllLocation(),
    staleTime: 5 * 60 * 1000,
  });

  const mutateUpdate = useCustomNavMutation(
    addBus,
    "/bus-manage",
    "Thêm xe thành công",
    "Thêm xe thất bại"
  );

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSelectedLocation = (selectedArrival: string) => {
    const getId = locationsData?.filter((lo) => lo.name === selectedArrival)[0].id;
    setForm((prev) => ({ ...prev, currentLocationId: Number(getId) }));
  };

  const handleAddBus = async () => {
    
    if(!form.capacity || !form.licensePlate) {
      toast.error("Bạn nhập thiếu dữ liệu")
      return
    }
    const regex = /^[0-9]{2}[A-Z]-[0-9]{4,5}$/i;
    if(regex.test(form?.licensePlate) === false) {
      toast.error("Biển số xe không đúng định dạng")
      return
    }

    const formData = new FormData();
    formData.append("data", JSON.stringify(form));

    images.forEach((image, index) => {
      formData.append("files", image.image);
      if (image.isMain) {
        const updateForm = { ...form };
        updateForm.indexIsMain = index.toString();
        formData.set("data", JSON.stringify(updateForm));
      } else {
        return toast.error("Vui lòng chọn ảnh chính");
      }
    });

    mutateUpdate.mutate(formData);
  };

  useEffect(() => {}, [images]);

  return (
    <div className={styles.container}>
      <div className={styles["feats"]}>
        <Link to={`/bus-manage`} className={`${styles["btn-back"]} ${styles.btn}`}>
          Quay lại
        </Link>
        <button className={`${styles["btn-delete"]} ${styles.btn}`}>Xóa</button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Ngăn không cho form submit mặc định
          handleAddBus();
        }}
        className={styles["update-car"]}
      >
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Thêm xe khách mới</h2>
        </div>
        <ul className={styles["input-list"]}>
          {[
            {
              label: "Biển số xe",
              name: "licensePlate",
              type: "text",
              placeholder: "Nhập biển số xe",
            },
            { label: "Sức chứa", name: "capacity", type: "number", placeholder: "Nhập sức chứa" },
            { label: "Loại xe", type: "select", name: "type" },
          ].map((item, index) => (
            <li key={index} className={` ${styles.item}`}>
              <label htmlFor={item.label} className={styles.title}>
                {item.label}
              </label>
              {item.type !== "select" ? (
                <input
                  className={styles.input}
                  type={item.type}
                  name={item.name}
                  placeholder={item.placeholder}
                  onChange={handleChangeValue}
                />
              ) : (
                <select
                  name={item.name}
                  id={item.label}
                  className={styles.input}
                  onChange={handleChangeValue}
                >
                  <option>--- Chọn loại xe ---</option>
                  {["xe thường", "xe giường nằm"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              )}
            </li>
          ))}

          <li className={styles.item}>
            <label className={styles.label}>Thành phố đang ở hiện tại:</label>
            {!isLocationLoading ? (
              <InputDropDownListCD
                idHTML="location"
                titleModal={"Địa điểm"}
                list={locationsData?.map((loc) => ({ id: loc.id, value: loc.name }))  || []}
                contentPlaceholder="Nhập địa điểm"
                onSelected={handleSelectedLocation}
                funcAddItem={addLocation}
                funcDelItem={deleteLocation}
              />
            ) : (
              <Loading />
            )}
          </li>

          <li className={`${styles.item} ${styles["action-img"]}`}>
            <p className={`${styles.title}`}>Hình ảnh</p>
            <div className={`${styles["img-list"]}`}>
              <div className={`${styles["img-item"]} ${styles["add-img"]}`}>
                <ImageListCUD images={images} setImages={setImages} />
              </div>
            </div>
          </li>
          <div className={styles.action}>
            <button type="submit" className={styles["btn-add"]}>
              Thêm xe
            </button>
          </div>
        </ul>
      </form>
    </div>
  );
};

export default AddBus;
