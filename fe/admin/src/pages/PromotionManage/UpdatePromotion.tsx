import styles from "../../styles/updateCD.module.scss";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPromotionById, updateInfoPromotion } from "../../services/promotion.service";
import Loading from "../../components/Loading";
import { useCustomNavMutation } from "../../hooks/useCustomQuery";

const UpdatePromotion = () => {
  const { id } = useParams<{ id: string }>();
  const idFetch = id ?? "0";
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["promotion", idFetch],
    queryFn: () => fetchPromotionById(idFetch),
    staleTime: 5 * 60 * 1000,
  });

  const promotion = data ?? null;

  const [form, setForm] = useState({
    id: id,
    code: "",
    carType: "",
    type: "",
    discountAmount: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const updateMutate = useCustomNavMutation(
    updateInfoPromotion,
    "/promotion-manage",
    "Cập nhật khuyến mãi thành công",
    "Cập nhật khuyến mãi thất bại"
  );

  const handleChangeValue = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleUpdatePromotion = async () => {
    const { id, ...data } = form;
    if (id) {
      await updateMutate.mutateAsync({ id: Number(id), data });
    }
  };

  useEffect(() => {
    if (promotion) {
      setForm({
        id: id,
        code: promotion.code ?? "",
        carType: promotion.carType ?? "",
        type: promotion.type ?? "",
        discountAmount: promotion.discountAmount.toString() ?? "",
        description: promotion.description ?? "",
        startDate: promotion.startDate?.split("T")[0] ?? "",
        endDate: promotion.endDate?.split("T")[0] ?? "",
      });
    }
  }, [promotion]);

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;
  if (!promotion) return <p className={styles.error}>Không tìm thấy thông tin khuyến mãi</p>;

  return (
    <div className={styles.container}>
      <div className={styles["feats"]}>
        <Link to={`/promotion-manage`} className={`${styles["btn-back"]} ${styles.btn}`}>
          Quay lại
        </Link>
        <button className={`${styles["btn-delete"]} ${styles.btn}`}>Xóa</button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdatePromotion();
        }}
        className={styles.update}
      >
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Cập nhật khuyến mãi</h2>
        </div>
        <ul className={styles["data-list"]}>
          <li className={styles.item}>
            <p className={styles.title}>Mã khuyến mãi</p>
            <input
              name="code"
              type="text"
              className={styles.data}
              value={form.code}
              onChange={handleChangeValue}
              readOnly
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Loại xe áp dụng</p>
            <select
              name="carType"
              className={styles.data}
              value={form.carType}
              onChange={handleChangeValue}
            >
              <option value="">--- Chọn loại xe ---</option>
              {["all", "xe thường", "xe giường nằm"].map((type, index) => (
                <option key={index} value={type}>
                  {type == "all" ? "Tất cả" : type === "xe thường" ? "Xe thường" : "Xe giường nằm"}
                </option>
              ))}
            </select>
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Loại giảm giá</p>
            <select
              name="type"
              className={styles.data}
              value={form.type}
              onChange={handleChangeValue}
            >
              <option value="">--- Chọn loại ---</option>
              {["percentage", "fixed"].map((t, index) => (
                <option key={index} value={t}>
                  {t === "percentage" ? "Phần trăm" : "Giá cố định"}
                </option>
              ))}
            </select>
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Giá trị giảm</p>
            <input
              name="discountAmount"
              type="number"
              className={styles.data}
              value={form.discountAmount}
              onChange={handleChangeValue}
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Mô tả</p>
            <textarea
              name="description"
              className={`${styles.data} ${styles.textarea}`}
              rows={3}
              value={form.description}
              onChange={handleChangeValue}
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Ngày bắt đầu</p>
            <input
              name="startDate"
              ref={startRef}
              type="date"
              className={styles.data}
              value={form.startDate}
              onChange={handleChangeValue}
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Ngày kết thúc</p>
            <input
              name="endDate"
              ref={endRef}
              type="date"
              className={styles.data}
              value={form.endDate}
              onChange={handleChangeValue}
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

export default UpdatePromotion;
