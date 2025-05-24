import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import { getCoDriverList } from "../../services/coDriver.service";
import styles from "../../styles/coDriverManage.module.scss";
import { ArrangeType } from "../../types/type";
import DefaultImage from "../../components/DefaultImage";
import { dateTimeTransform } from "../../utils/transform";
import { Button, Modal } from 'react-bootstrap';

const ITEMS_PER_PAGE = 10;

const ManageCoDriver: React.FC = () => {
  const navigate = useNavigate();
  const { page } = useParams<{ page?: string }>();
  const location = useLocation();
  const [arrangeType, setArrangeType] = useState<ArrangeType>("desc");
  const [currentPage, setCurrentPage] = useState<number>(
    page ? Math.max(1, parseInt(page, 10)) - 1 : 0
  );
  const urlMain = "/co-driver-manage";

  // Khi URL thay đổi, cập nhật currentPage
  useEffect(() => {
    const pageNum = page ? Math.max(1, parseInt(page, 10)) - 1 : 0;
    setCurrentPage(pageNum);
  }, [location.pathname]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["coDriverList", currentPage, arrangeType],
    queryFn: () =>
      getCoDriverList({
        offset: currentPage * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        arrangeType: arrangeType,
      }),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const total = data?.total ?? 0;
  const coDriverData = data?.data || [];

  const toggleArrangeType = () => {
    setArrangeType((prevArrangeType) => (prevArrangeType === "asc" ? "desc" : "asc"));
  };
  const handlePageClick = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(selectedItem.selected); // Cập nhật state ngay lập tức
    navigate(newPage > 1 ? `/co-driver-manage/page/${newPage}` : `/co-driver-manage`, {
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

        <Link to={"/co-driver-manage/add"} className={styles["btn-add"]}>
          Thêm phụ xe
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
              <th>Ngày sinh</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {coDriverData.map((coDriver, index) => (
              <tr key={index}>
                <td
                  className={styles["user-id"]}
                  onClick={() => coDriver.id && handleRedirectDetail(coDriver.id)}
                >
                  {index + 1 + currentPage * ITEMS_PER_PAGE}
                </td>
                <td>{coDriver.email}</td>
                <td>
                  <DefaultImage src={coDriver.urlImg} />
                </td>
                <td>{coDriver.fullName}</td>
                <td>{coDriver.phone}</td>
                <td>{dateTimeTransform(coDriver.dateBirth, "DD/MM/YYYY", false)}</td>
                <td>
                  <div className={styles["btn-list"]}>
                    <Link
                      to={`${urlMain}/detail/${coDriver.id}`}
                      className={`${styles["btn-detail"]} ${styles.btn}`}
                    >
                      Chi tiết
                    </Link>
                    <Link
                      to={`${urlMain}/update/${coDriver.id}`}
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

export default ManageCoDriver;
