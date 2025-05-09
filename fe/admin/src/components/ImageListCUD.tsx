import { memo, useRef } from "react";
import ImageCUD from "./ImageCUD";
import styles from "../styles/imageListCUD.module.scss";
import { toast } from "react-toastify";

export interface ImageCUDType {
  id: number;
  image: File;
  previewImg: string;
  isMain: boolean;
}

interface ImageListCUDProps {
  images: ImageCUDType[];
  setImages: React.Dispatch<React.SetStateAction<ImageCUDType[]>>;
}

const ImageListCUD: React.FC<ImageListCUDProps> = ({ images, setImages }) => {
  const filesRef = useRef<HTMLInputElement>(null);
  // const [images, setImages] = useState<ImageType[]>([]);

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length > 5) {
      toast.warning("Chỉ được chọn tối đa 5 ảnh");
      return;
    }
    if (e.target.files) {
      const newImgs = Array.from(e.target.files).map((file) => ({
        id: Date.now() + Math.random(),
        image: file,
        previewImg: URL.createObjectURL(file),
        isMain: false,
      }));
      setImages((prevImgs) => [...prevImgs, ...newImgs]);
    }
  };

  const handleDeleteImage = (id: number) => {
    setImages(images.filter((image) => image.id !== id));
  };

  const handleUpdateImage = (id: number, newFile: File, newPreview: string) => {
    setImages((prevImgs) =>
      prevImgs.map((image) =>
        image.id === id ? { ...image, image: newFile, prevImg: newPreview } : image
      )
    );
  };

  const handleIsMainImage = (id: number) => {
    setImages((prevImgs) => {
      const isCurrentMain = prevImgs.find((image) => image.id === id)?.isMain;
      return prevImgs.map((image) => ({
        ...image,
        isMain: isCurrentMain ? false : image.id === id,
      }));
    });
  };

  return (
    <div className={styles.container}>
      <button type="button" className={styles["add-btn"]} onClick={() => filesRef.current?.click()}>
        Thêm ảnh
      </button>
      <div className={styles["img-list"]}>
        {images.map((image) => (
          <ImageCUD
            key={image.id}
            id={image.id}
            imgCUD={true}
            onDelete={handleDeleteImage}
            imgFile={image.image}
            previewImg={image.previewImg}
            isMain={image.isMain}
            onUpdate={handleUpdateImage}
            onIsMain={handleIsMainImage}
          />
        ))}
      </div>
      {/* Hidden */}
      <input
        ref={filesRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        style={{ display: "none" }}
        onChange={handleAddImage}
        multiple
      />
    </div>
  );
};

export default memo(ImageListCUD);
