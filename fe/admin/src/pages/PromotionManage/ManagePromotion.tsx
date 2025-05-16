import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import FilterCheckbox from "../../components/FilterCheckbox";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import SearchInput from "../../components/SearchInput";
import SelectType from "../../components/SelectType";
import { getPromotionList } from "../../services/promotion.service";
import styles from "../../styles/promotionManage.module.scss";
import { ArrangeType } from "../../types/type";
import { debounce } from "../../utils/debounce";
import formatCurrency from "../../utils/formatCurrency";

const ITEMS_PER_PAGE = 2;

const PromotionManage: React.FC = () => {
  const navigate = useNavigate();
  const { page } = useParams<{ page?: string }>();
  const location = useLocation();
  const [arrangeType, setArrangeType] = useState<ArrangeType>("desc");
  const [currentPage, setCurrentPage] = useState<number>(
    page ? Math.max(1, parseInt(page, 10)) - 1 : 0
  );
  const [searchCodeValue, setSearchCodeValue] = useState<string>("");
  const [selectedType, setSelectedType] = useState<"all" | "percentage" | "fixed">("all");
  const [selectedCarTypes, setSelectedCarTypes] = useState<string[]>([]);

  const urlMain = "/promotion-manage";

  useEffect(() => {
    const pageNum = page ? Math.max(1, parseInt(page, 10)) - 1 : 0;
    setCurrentPage(pageNum);
  }, [location.pathname]);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "promotionList",
      currentPage,
      arrangeType,
      searchCodeValue,
      selectedType,
      selectedCarTypes,
    ],
    queryFn: () =>
      getPromotionList({
        offset: currentPage * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        arrangeType,
        codeSearch: searchCodeValue,
        type: selectedType,
        carTypes: selectedCarTypes, // Truyền selectedCarTypes vào API
      }),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const total = data?.total ?? 0;
  const promotions = data?.data || [];

  const toggleArrangeType = () => {
    setArrangeType((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleChangeValueSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCodeValue(e.target.value);
  }, 200);

  const handleSelectedTypeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSelectedType(e.target.value as "all" | "percentage" | "fixed");
  };

  const handleCarTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedCarTypes((prev) => (checked ? [...prev, value] : prev.filter((t) => t !== value)));
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(selectedItem.selected);
    navigate(newPage > 1 ? `${urlMain}/page/${newPage}` : `${urlMain}`, {
      replace: true,
    });
  };

  const handleRedirectDetail = (id: number) => {
    navigate(`${urlMain}/detail/${id}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data]);

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SearchInput placeholder="Tìm kiếm theo mã" onChange={handleChangeValueSearch} />
        <Link to={`${urlMain}/add`} className={styles["btn-add"]}>
          Thêm khuyến mãi
        </Link>
      </div>

      <div className={styles["filter-wrapper"]}>
        {/* <div className={styles["filter-type"]}>
          <p className={styles["type-title"]}>Kiểu khuyến mãi</p>
          {["all", "percentage", "fixed"].map((type) => (
            <div key={type} className={styles["type-item"]}>
              <div className={styles.radio}>
                <input
                  type="radio"
                  name="promotion_type"
                  id={type}
                  value={type}
                  onChange={handleSelectedTypeChange}
                  checked={selectedType === type}
                />
              </div>
              <div className={styles.label}>
                <label htmlFor={type}>
                  {type === "all" ? "Tất cả" : type === "percentage" ? "Phần trăm" : "Giá cố định"}
                </label>
              </div>
            </div>
          ))}
        </div> */}
        <SelectType selectedType={selectedType} onChange={handleSelectedTypeChange} />
        <FilterCheckbox
          title="Loại xe"
          types={["xe thường", "xe giường nằm"]}
          selectedTypes={selectedCarTypes}
          onChange={handleCarTypeChange}
        />
      </div>

      <div className={styles["table-wrapper"]}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <div className={styles["numerical-order"]}>
                  <p>STT</p>
                  <GoTriangleDown
                    className={`${styles.icon} ${
                      arrangeType === "desc" ? styles.desc : styles.asc
                    }`}
                    onClick={toggleArrangeType}
                  />
                </div>
              </th>
              <th>Mã KM</th>
              <th>Giảm giá</th>
              <th>Kiểu</th>
              <th>Mô tả</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo, index) => (
              <tr key={promo.id}>
                <td onClick={() => handleRedirectDetail(promo.id)}>
                  {index + 1 + currentPage * ITEMS_PER_PAGE}
                </td>
                <td>{promo.code}</td>
                <td>
                  {promo.type === "percentage"
                    ? `${promo.discountAmount}%`
                    : `${formatCurrency(promo.discountAmount)}`}
                </td>
                <td>{promo.type === "percentage" ? "Phần trăm" : "Giá cố định"}</td>
                <td>{promo.description || "Không có mô tả"}</td>
                <td>
                  <div className={styles["actions"]}>
                    <Link
                      to={`${urlMain}/detail/${promo.id}`}
                      className={`${styles["btn-detail"]} ${styles.btn}`}
                    >
                      Chi tiết
                    </Link>
                    <Link
                      to={`${urlMain}/update/${promo.id}`}
                      className={`${styles["btn-edit"]} ${styles.btn}`}
                    >
                      Cập nhật
                    </Link>
                    <button className={`${styles["btn-delete"]} ${styles.btn}`}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <Pagination
          pageCount={Math.ceil(total / ITEMS_PER_PAGE)}
          onPageChange={handlePageClick}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default PromotionManage;
