import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import styles from "../../styles/manageCustomer.module.scss";
import { ArrangeType } from "../../types/type";
import DefaultImage from "../../components/DefaultImage";
import { dateTimeTransform } from "../../utils/transform";
import { getDriverList } from "../../services/driver.service";


const ITEMS_PER_PAGE = 10;

const ManageDriver: React.FC = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate();
  const { page } = useParams<{ page?: string }>();
  const location = useLocation();
  const [arrangeType, setArrangeType] = useState<ArrangeType>("desc");
  const [currentPage, setCurrentPage] = useState<number>(
    page ? Math.max(1, parseInt(page, 10)) - 1 : 0
  );
  const urlMain = "/driver-manage";

  // Khi URL thay đổi, cập nhật currentPage
  useEffect(() => {
    const pageNum = page ? Math.max(1, parseInt(page, 10)) - 1 : 0;
    setCurrentPage(pageNum);
  }, [location.pathname]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["driverList", currentPage, arrangeType],
    queryFn: () =>
      getDriverList({
        offset: currentPage * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        arrangeType: arrangeType,
      }),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const total = data?.total ?? 0;
  const driverData = data?.data || [];

  const toggleArrangeType = () => {
    setArrangeType((prevArrangeType) => (prevArrangeType === "asc" ? "desc" : "asc"));
  };
  const handlePageClick = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(selectedItem.selected); // Cập nhật state ngay lập tức
    navigate(newPage > 1 ? `/driver-manage/page/${newPage}` : `/driver-manage`, {
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
            // onChange={handleSearch}
          />
        </div>

        <Link to={"/driver-manage/add"} className={styles["btn-add"]}>
          Thêm tài xế
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
              <th>Email</th>
              <th>Hình ảnh</th>
              <th>Họ và tên</th>
              <th>SĐT</th>
              <th>Mã giấy phép</th>
              <th>Ngày sinh</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {driverData.map((driver, index) => (
              <tr key={index}>
                <td
                  className={styles["driver-id"]}
                  onClick={() => driver.id && handleRedirectDetail(driver.id)}
                >
                  {index + 1 + currentPage * ITEMS_PER_PAGE}
                </td>
                <td>{driver.email}</td>
                <td>
                  <DefaultImage src={driver.urlImg} />
                </td>
                <td>{driver.fullName}</td>
                <td>{driver.phone}</td>
                <td>{driver.licenseNumber}</td>
                <td>{dateTimeTransform(driver.dateBirth, "DD/MM/YYYY", false)}</td>
                <td>
                  <div className={styles["btn-list"]}>
                    <Link
                      to={`${urlMain}/detail/${driver.id}`}
                      className={`${styles["btn-detail"]} ${styles.btn}`}
                    >
                      Chi tiết
                    </Link>
                    <Link
                      to={`${urlMain}/update/${driver.id}`}
                      className={`${styles["btn-edit"]} ${styles.btn}`}
                    >
                      Cập nhật
                    </Link>
                   
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

export default ManageDriver;
