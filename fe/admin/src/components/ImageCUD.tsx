import styles from "../styles/imageCUD.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { memo, useRef, useState } from "react";
import DefaultImage from "./DefaultImage";

interface ImageCUDProps {
  id?: number;
  imgCUD: boolean;
  imgFile: File;
  previewImg: string;
  isMain: boolean;
  onUpdate?: (id: number, newFile: File, newPreview: string) => void;
  onDelete?: (id: number) => void;
  onIsMain?: (id: number) => void;
}

const ImageCUD: React.FC<ImageCUDProps> = ({
  id,
  imgCUD = true,
  imgFile,
  previewImg,
  isMain,
  onUpdate,
  onDelete,
  onIsMain,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const imageFileRef = useRef<File | null>(imgFile);
  const [previewImgFile, setPreviewImgFile] = useState<string | null>(previewImg);

  const handleClickUpdate = () => {
    fileRef.current?.click();
  };

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newImg = e.target.files[0];
      const newPreview = URL.createObjectURL(newImg);

      imageFileRef.current = newImg;
      setPreviewImgFile(newPreview);

      if (onUpdate && id !== undefined) {
        onUpdate(id, newImg, newPreview);
      }
    }
  };

  const handleClickIsMain = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (onIsMain && id !== undefined) onIsMain(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (onDelete && id !== undefined) onDelete(id);
  };
  return (
    <div className={styles.container}>
      <DefaultImage key={previewImgFile} src={previewImgFile ?? ""} />
      {imgCUD ? (
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles["start-btn"]} ${styles.btn}`}
            title="Ảnh chính"
            onClick={handleClickIsMain}
          >
            <FontAwesomeIcon
              className={`${styles.ic} ${isMain ? styles.main : ""}`}
              icon={faStar}
            />
          </button>
          <button
            type="button"
            className={`${styles["update-btn"]} ${styles.btn}`}
            title="Cập nhật"
            onClick={handleClickUpdate}
          >
            <FontAwesomeIcon className={`${styles.ic}`} icon={faPenToSquare} />
          </button>
          <button
            type="button"
            className={`${styles["delete-btn"]} ${styles.btn}`}
            title="Xóa"
            onClick={handleDelete}
          >
            <FontAwesomeIcon className={`${styles.ic}`} icon={faTrash} />
          </button>
        </div>
      ) : null}
      {/* hidden */}
      <input
        ref={fileRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        style={{ display: "none" }}
        onChange={handleChangeImg}
      />
    </div>
  );
};

export default memo(ImageCUD);
