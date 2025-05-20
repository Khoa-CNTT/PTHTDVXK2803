import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { GoTriangleDown } from "react-icons/go";
import { Link, useSearchParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import styles from "../../styles/busManage.module.scss";
import { ArrangeType } from "../../types/type";
import DefaultImage from "../../components/DefaultImage";
import { debounce } from "../../utils/debounce";
import { getBusList } from "../../services/bus.service";

const ITEMS_PER_PAGE = 5;

const BusManage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [arrangeType, setArrangeType] = React.useState<ArrangeType>("desc");

  const licensePlate = searchParams.get("license_plate") ?? "";
  const selectedType = (
    ["all", "xe-thuong", "xe-giuong-nam"].includes(searchParams.get("type") || "")
      ? searchParams.get("type")
      : "all"
  ) as "all" | "xe-thuong" | "xe-giuong-nam";

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const { data, isLoading, error } = useQuery({
    queryKey: ["busList", currentPage, arrangeType, licensePlate, selectedType],
    queryFn: () =>
      getBusList({
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        arrangeType,
        licensePlateSearch: licensePlate,
        type: selectedType,
      }),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const total = data?.total ?? 0;
  const carsData = data?.data || [];

  const urlMain = "/bus-manage";

  const handleChangeValueSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);

    if (value) newParams.set("license_plate", value);
    else newParams.delete("license_plate");

    newParams.set("page", "1"); // Reset trang
    setSearchParams(newParams);
  }, 300);

  const handleSelectedTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);

    if (value) newParams.set("type", value);
    else newParams.delete("type");

    newParams.set("page", "1"); // Reset trang
    setSearchParams(newParams);
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", (selectedItem.selected + 1).toString());
    setSearchParams(newParams);
  };

  const toggleArrangeType = () => {
    setArrangeType((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data]);

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
            defaultValue={licensePlate}
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
        <Link to={`${urlMain}/add`} className={styles["btn-add"]}>
          Thêm xe
        </Link>
      </div>

      <div className={styles["table-wrapper"]}>
        {isLoading ? (
          <Loading />
        ) : (
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
                  <td>{index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}</td>
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
        )}
      </div>

      <div className={styles.pagination}>
        <Pagination
          pageCount={Math.ceil(total / ITEMS_PER_PAGE)}
          onPageChange={handlePageClick}
          currentPage={currentPage - 1}
        />
      </div>
    </div>
  );
};

export default BusManage;
