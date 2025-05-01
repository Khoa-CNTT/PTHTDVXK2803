import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import styles from "../../styles/busManage.module.scss";
import { ArrangeType } from "../../types/type";
import DefaultImage from "../../components/DefaultImage";
import { debounce } from "../../utils/debounce.util";
import { getBusList } from "../../services/bus.service";

const ITEMS_PER_PAGE = 10;

const BusManage: React.FC = () => {
  const navigate = useNavigate();
  const { page } = useParams<{ page?: string }>();
  const location = useLocation();
  const [arrangeType, setArrangeType] = useState<ArrangeType>("desc");
  const [currentPage, setCurrentPage] = useState<number>(
    page ? Math.max(1, parseInt(page, 10)) - 1 : 0
  );
  const [searchLicensePlateValue, setSearchLicensePlateValue] = useState<string>("");
  const [selectedType, setSelectedType] = useState<"xe-thuong" | "xe-giuong-nam" | "all">("all");

  const urlMain = "/bus-manage";

  // Khi URL thay đổi, cập nhật currentPage
  useEffect(() => {
    const pageNum = page ? Math.max(1, parseInt(page, 10)) - 1 : 0;
    setCurrentPage(pageNum);
  }, [location.pathname]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["busList", currentPage, arrangeType, searchLicensePlateValue, selectedType],
    queryFn: () =>
      getBusList({
        offset: currentPage * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        arrangeType: arrangeType,
        licensePlateSearch: searchLicensePlateValue,
        type: selectedType,
      }),
    staleTime: 5 * 60 * 10,
    placeholderData: (previousData) => previousData,
  });

  const total = data?.total ?? 0;
  const carsData = data?.data || [];

  const toggleArrangeType = () => {
    setArrangeType((prevArrangeType) => (prevArrangeType === "asc" ? "desc" : "asc"));
  };

  const handleChangeValueSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchLicensePlateValue(e.target.value);
  }, 200);

  const handleSelectedTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(e.target.value as "all" | "xe-thuong" | "xe-giuong-nam");
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(selectedItem.selected); // Cập nhật state ngay lập tức
    navigate(newPage > 1 ? `/bus-manage/page/${newPage}` : `/bus-manage`, {
      replace: true,
    });
  };

  const handleRedirectDetail = (id: number) => {
    navigate(`${urlMain}/detail/${id}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll lên đầu khi chuyển trang
  }, [data]);

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className={styles["search-input"]}
            onChange={handleChangeValueSearch}
          />
        </div>
        <div className={`${"filter-type"} ${styles["type-list"]}`}>
          {["all", "xe-thuong", "xe-giuong-nam"].map((type) => (
            <div key={type} className={styles["type-item"]}>
              <div className={styles.radio}>
                <input
                  type="radio"
                  name="bus_type"
                  id={type}
                  value={type}
                  onChange={handleSelectedTypeChange}
                  checked={selectedType === type}
                />
              </div>
              <div className={styles.label}>
                <label htmlFor={type}>
                  {type === "all" ? "Tất cả" : type === "xe-thuong" ? "Xe thường" : "Xe giường nằm"}
                </label>
              </div>
            </div>
          ))}
        </div>
        <Link to={"/bus-manage/add"} className={styles["btn-add"]}>
          Thêm xe khách
        </Link>
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
              <th>Hình ảnh</th>
              <th>Biển số xe</th>
              <th>Sức chứa</th>
              <th>Loại xe</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {carsData.map((car, index) => (
              <tr key={index}>
                <td
                  className={styles["user-id"]}
                  onClick={() => car.id && handleRedirectDetail(car.id)}
                >
                  {index + 1 + currentPage * ITEMS_PER_PAGE}
                </td>
                <td>
                  <DefaultImage src={car.image.urlImg} />
                </td>
                <td>{car.licensePlate}</td>
                <td>{car.capacity ? `${car.capacity} chỗ` : "N/A"} </td>
                <td>{car.type}</td>
                <td>
                  <div className={styles["btn-list"]}>
                    <Link
                      to={`${urlMain}/detail/${car.licensePlate}`}
                      className={`${styles["btn-detail"]} ${styles.btn}`}
                    >
                      Chi tiết
                    </Link>
                    <Link
                      to={`${urlMain}/update/${car.licensePlate}`}
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

export default BusManage;
