import styles from "../../styles/updateCD.module.scss";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPromotionById } from "../../services/promotion.service";
import Loading from "../../components/Loading";
import formatCurrency from "../../utils/formatCurrency";

const DetailPromotion = () => {
  const { id } = useParams<{ id: string }>();
  const idFetch = id ?? "0";

  const { data, isLoading, error } = useQuery({
    queryKey: ["promotion", idFetch],
    queryFn: () => fetchPromotionById(idFetch),
    staleTime: 5 * 60 * 1000,
  });

  const promotion = data ?? null;

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;
  if (!promotion) return <p className={styles.error}>Không tìm thấy thông tin khuyến mãi</p>;

  return (
    <div className={styles.container}>
      <div className={styles.feats}>
        <Link to={`/promotion-manage`} className={`${styles["btn-back"]} ${styles.btn}`}>
          Quay lại
        </Link>
        <Link
          to={`/promotion-manage/update/${promotion.id}`}
          className={`${styles["btn-update"]} ${styles.btn}`}
        >
          Chỉnh sửa
        </Link>
      </div>

      <div className={styles.update}>
        <div className={styles.title}>
          <h2 className={styles["content-title"]}>Chi tiết khuyến mãi</h2>
        </div>
        <ul className={styles["data-list"]}>
          <li className={styles.item}>
            <p className={styles.title}>Mã khuyến mãi</p>
            <input value={promotion.code ?? "N/A"} className={styles.data} readOnly />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Loại xe áp dụng</p>
            <input value={promotion.carType ?? "N/A"} className={styles.data} readOnly />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Loại giảm giá</p>
            <input
              value={promotion.type === "percentage" ? "Phần trăm" : "Giá cố định"}
              className={styles.data}
              readOnly
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Giá trị giảm</p>
            <input
              value={
                promotion.type === "fixed"
                  ? formatCurrency(promotion.discountAmount)
                  : `${promotion.discountAmount}%`
              }
              className={styles.data}
              readOnly
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Mô tả</p>
            <textarea
              className={`${styles.data} ${styles.textarea}`}
              rows={3}
              value={promotion.description ?? "N/A"}
              readOnly
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Ngày bắt đầu</p>
            <input
              value={promotion.startDate?.split("T")[0] ?? "N/A"}
              className={styles.data}
              readOnly
            />
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Ngày kết thúc</p>
            <input
              value={promotion.endDate?.split("T")[0] ?? "N/A"}
              className={styles.data}
              readOnly
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DetailPromotion;
