import React, { useCallback, useRef, useState } from "react";
import styles from "../styles/defaultImage.module.scss";
import { useCustomNavMutation } from "../hooks/useCustomQuery";
import { updateImgCustomer } from "../services/customer.service";
import { toast } from "react-toastify";
import { useLocation } from "react-router";
import { updateImgDriver } from "../services/driver.service";
import { updateImgCoDriver } from "../services/coDriver.service";

type DefaultImageProps = {
  id?: number;
  src?: string;
  publicId?: string;
  updateType?: "customer" | "driver" | "co-driver";
  onSelectedImg?: (img: File) => void;
};

const DefaultImage: React.FunctionComponent<DefaultImageProps> = ({
  id,
  src,
  publicId,
  updateType,
  onSelectedImg,
}) => {
  const location = useLocation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(src || null);
  const [file, setFile] = useState<File | null>(null);
  const updateFunc =
    updateType === "customer"
      ? updateImgCustomer
      : updateType === "co-driver"
      ? updateImgCoDriver
      : updateImgDriver;
  const message =
    updateType === "customer"
      ? "Cập nhật ảnh đại diện"
      : updateType === "driver"
      ? "Cập nhật ảnh tài xế"
      : "Cập nhật ảnh phụ xe";

  const mutateUpdate = useCustomNavMutation(
    updateFunc,
    location.pathname as string,
    `${message} thành công`,
    `${message} thất bại`
  );
  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newImg = e.target.files[0];
      const newPreview = URL.createObjectURL(newImg);
      setFile(newImg);
      setPreview(newPreview);
      if (onSelectedImg) {
        onSelectedImg(newImg);
      }
    }
  };

  const handleClickUpdateImg = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleClickUpdate = async () => {
    if (file && id) {
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("publicId", publicId ?? "");
      formData.append("file", file);
      await mutateUpdate.mutateAsync(formData);
    } else {
      toast.warn("Vui lòng chọn ảnh trước khi cập nhật");
    }
  };

  if (!updateType && !onSelectedImg) {
    return (
      <div className={styles.container}>
        {preview ? (
          <img
            className={styles.img}
            src={preview}
            alt="Hình ảnh đã chọn"
            loading="lazy"
            onClick={handleClickUpdateImg}
          />
        ) : (
          <p className={styles["no-img"]} onClick={handleClickUpdateImg}>
            No Image
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <input
        ref={fileRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        style={{ position: "absolute", visibility: "hidden", width: 0, height: 0 }}
        onChange={handleChangeImg}
      />

      {preview ? (
        <img
          className={styles.img}
          src={preview}
          alt="Hình ảnh đã chọn"
          loading="lazy"
          onClick={handleClickUpdateImg}
        />
      ) : (
        <p className={styles["no-img"]} onClick={handleClickUpdateImg}>
          No Image
        </p>
      )}
      {updateType && (
        <button type="button" className={styles.btn} onClick={handleClickUpdate}>
          Cập nhật
        </button>
      )}
    </div>
  );
};

export default DefaultImage;
