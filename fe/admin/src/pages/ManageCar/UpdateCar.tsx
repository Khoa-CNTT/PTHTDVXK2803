import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Image from "../../components/Image";
import ImageListCUD, { ImageCUDType } from "../../components/ImageListCUD";
import Loading from "../../components/Loading";
import { useCustomNavMutation } from "../../hooks/useCustomQuery";
import { getDetailCar, updateCar } from "../../services/car.service";
import styles from "../../styles/updateCar.module.scss";
import { dateTimeTransform } from "../../utils/transform";

const UpdateCar = () => {
  const { id } = useParams();
  const idFetch = id ?? "0";

  const { data, isLoading, error } = useQuery({
    queryKey: ["customer", idFetch],
    queryFn: () => getDetailCar(idFetch),
    staleTime: 5 * 60 * 10,
  });

  const car = data;
  const [images, setImages] = useState<ImageCUDType[]>([]);

  const [form, setForm] = useState({
    id: id,
    licensePlate: "",
    capacity: 0,
    type: "",
    indexIsMain: "",
  });

  const mutateUpdate = useCustomNavMutation(
    updateCar,
    "/car-manage",
    "Cập nhật xe thành công",
    "Cập nhật xe thất bại"
  );

  const imgsLength = car?.images?.length ?? 0;
  // const imageList = car?.images ?? null;

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleUpdateCar = async () => {
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

  useEffect(() => {
    if (car) {
      setForm({
        licensePlate: car.licensePlate,
        capacity: car.capacity,
        type: car.type,
        indexIsMain: "",
        id: id,
      });
    }
  }, [car]);

  useEffect(() => {}, [images]);

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;

  return (
    <div className={styles.container}>
      <div className={styles["feats"]}>
        <Link to={`/car-manage`} className={`${styles["btn-back"]} ${styles.btn}`}>
          Quay lại
        </Link>
        <button className={`${styles["btn-delete"]} ${styles.btn}`}>Xóa</button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Ngăn không cho form submit mặc định
          handleUpdateCar();
        }}
        className={styles["update-car"]}
      >
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Thông tin cập nhật</h2>
        </div>
        <ul className={styles["data-list"]}>
          {[
            { label: "Biển số xe", value: form?.licensePlate, name: "licensePlate" },
            { label: "Sức chứa", value: form?.capacity, name: "capacity" },
            { label: "Loại xe", value: form?.type, type: "select", name: "type" },
            {
              label: "Ngày tạo",
              value: dateTimeTransform(car?.createAt, "DD-MM-YYYY"),
              readonly: true,
            },
            {
              label: "Ngày cập nhật",
              value: dateTimeTransform(car?.updateAt, "DD-MM-YYYY"),
              readonly: true,
            },
          ].map((item, index) => (
            <li key={index} className={` ${styles.item}`}>
              <label htmlFor={item.label} className={styles.title}>
                {item.label}
              </label>
              {item.readonly ? (
                <input
                  className={styles.data}
                  id={item.label}
                  value={item.value ?? "N/A"}
                  readOnly
                />
              ) : item.type !== "select" ? (
                <input
                  className={styles.data}
                  id={item.label}
                  name={item.name}
                  value={item.value ?? "N/A"}
                  onChange={handleChangeValue}
                />
              ) : (
                <select
                  name={item.name}
                  id={item.label}
                  className={styles.data}
                  onChange={handleChangeValue}
                  value={item.value}
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
          <li className={` ${styles.item}`}>
            <p className={`${styles.title}`}>Hình ảnh</p>
            <div className={`${styles["img-list"]}`}>
              {car?.images && imgsLength > 0
                ? car?.images?.map((img) => (
                    <div key={img.id} className={`${styles["img-item"]}`}>
                      {/* //   <img src={img.urlImg} alt={`Hình ảnh ${index}`} className={`${styles.img}`} /> */}
                      <Image
                        key={img.id}
                        id={img.id ?? 0}
                        imgCUD={true}
                        isMain={img.isMain}
                        urlImg={img.urlImg}
                        urlPublicImg={img.urlPublicImg}
                      />{" "}
                    </div>
                  ))
                : null}
            </div>
          </li>
          <li className={` ${styles.item}`}>
            <p className={`${styles.title}`}>Hình ảnh Mới</p>
            <div className={`${styles["img-list"]}`}>
              <div className={`${styles["img-item"]} ${styles["add-img"]}`}>
                <ImageListCUD images={images} setImages={setImages} />
              </div>
            </div>
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

export default UpdateCar;
