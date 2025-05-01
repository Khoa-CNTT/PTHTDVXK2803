import styles from "../../styles/addBus.module.scss";
import { addBus } from "../../services/bus.service";
import { Link } from "react-router-dom";
import ImageListCUD, { ImageCUDType } from "../../components/ImageListCUD";
import { useEffect, useState } from "react";
import { useCustomNavMutation } from "../../hooks/useCustomQuery";

const AddBus = () => {
  const [images, setImages] = useState<ImageCUDType[]>([]);

  const [form, setForm] = useState({
    licensePlate: "",
    capacity: 0,
    type: "",
    indexIsMain: "",
  });

  const mutateUpdate = useCustomNavMutation(
    addBus,
    "/bus-manage",
    "Thêm xe thành công",
    "Thêm xe thất bại"
  );

  // const imageList = car?.images ?? null;

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleAddBus = async () => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(form));

    images.forEach((image, index) => {
      formData.append("files", image.image);
      if (image.isMain) {
        const updateForm = { ...form };
        updateForm.indexIsMain = index.toString();
        formData.set("data", JSON.stringify(updateForm));
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
          <h2 className={styles["content-title"]}>Thông tin chi tiết</h2>
        </div>
        <ul className={styles["input-list"]}>
          {[
            { label: "Biển số xe", name: "licensePlate" },
            { label: "Sức chứa", name: "capacity" },
            { label: "Loại xe", type: "select", name: "type" },
          ].map((item, index) => (
            <li key={index} className={` ${styles.item}`}>
              <label htmlFor={item.label} className={styles.title}>
                {item.label}
              </label>

              {item.type !== "select" ? (
                <input
                  className={styles.input}
                  id={item.label}
                  name={item.name}
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
