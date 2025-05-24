import { useParams } from "react-router";
import styles from "../../styles/updateBus.module.scss";
import { getDetailBus, updateBus } from "../../services/bus.service";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { dateTimeTransform } from "../../utils/transform";
import ImageListCUD, { ImageCUDType } from "../../components/ImageListCUD";
import { useEffect, useState } from "react";
import Image from "../../components/Image";
import { useCustomNavMutation } from "../../hooks/useCustomQuery";

const UpdateBus = () => {
  const { licensePlate } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["bus", licensePlate],
    queryFn: () => getDetailBus(licensePlate || ''),
    staleTime: 5 * 60 * 1000,
  });

  const bus = data ?? null;
  const [images, setImages] = useState<ImageCUDType[]>([]);

  const [form, setForm] = useState({
    id: bus?.id,
    licensePlate: licensePlate,
    capacity: 0,
    type: "",
    indexIsMain: "",
  });

  const mutateUpdate = useCustomNavMutation(
    updateBus,
    "/bus-manage",
    "Cập nhật xe thành công",
    "Cập nhật xe thất bại"
  );

  const imgsLength = bus?.images?.length ?? 0;
  // const imageList = bus?.images ?? null;

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleUpdateBus = async () => {
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
    if (bus) {
      setForm({
        id: bus.id,
        licensePlate: bus.licensePlate,
        capacity: bus.capacity,
        type: bus.type,
        indexIsMain: "",
      });
    }
  }, [bus]);

  useEffect(() => {}, [images]);

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;

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
          handleUpdateBus();
        }}
        className={styles["update-bus"]}
      >
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Thông tin cập nhật</h2>
        </div>
        <ul className={styles["data-list"]}>
          {[
            {
              label: "Biển số xe",
              value: form?.licensePlate,
              name: "licensePlate",
              readonly: true,
            },
            { label: "Sức chứa", value: form?.capacity, name: "capacity" },
            { label: "Loại xe", value: form?.type, type: "select", name: "type" },
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
              {bus?.images && imgsLength > 0
                ? bus?.images?.map((img) => (
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

          {[
            {
              label: "Ngày tạo",
              value: dateTimeTransform(bus?.createAt, "DD-MM-YYYY"),
              readonly: true,
            },
            {
              label: "Ngày cập nhật",
              value: dateTimeTransform(bus?.updateAt, "DD-MM-YYYY"),
              readonly: true,
            },
          ].map((item, index) => (
            <li key={index} className={` ${styles.item}`}>
              <label htmlFor={item.label} className={styles.title}>
                {item.label}
              </label>
              <input className={styles.data} id={item.label} value={item.value ?? "N/A"} readOnly />
            </li>
          ))}

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

export default UpdateBus;
