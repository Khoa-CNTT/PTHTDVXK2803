import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import DefaultImage from "../../components/DefaultImage";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import { getCustomerList } from "../../services/customer.service";
import styles from "../../styles/manageCustomer.module.scss";
import { ArrangeType } from "../../types/type";
import { debounce } from "../../utils/debounce";
import { dateTimeTransform } from "../../utils/transform";

const ITEMS_PER_PAGE = 10;

const ManageCustomer: React.FC = () => {
  const navigate = useNavigate();
  const { page } = useParams<{ page?: string }>();
  const location = useLocation();
  const [arrangeType, setArrangeType] = useState<ArrangeType>("desc");
  const [currentPage, setCurrentPage] = useState<number>(
    page ? Math.max(1, parseInt(page, 10)) - 1 : 0
  );
  const [searchEmailValue, setSearchEmailValue] = useState<string>("");

  const urlMain = "/customer-manage";

  // Khi URL thay đổi, cập nhật currentPage
  useEffect(() => {
    const pageNum = page ? Math.max(1, parseInt(page, 10)) - 1 : 0;
    setCurrentPage(pageNum);
  }, [location.pathname]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["customers", currentPage, arrangeType, searchEmailValue],
    queryFn: () =>
      getCustomerList({
        offset: currentPage * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        arrangeType: arrangeType,
        emailSearch: searchEmailValue,
      }),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const total = data?.total ?? 0;
  const customerData = data?.data || [];

  const toggleArrangeType = () => {
    setArrangeType((prevArrangeType) => (prevArrangeType === "asc" ? "desc" : "asc"));
  };

  const debouncedSetSearchEmailValue = debounce((value: string) => {
    setSearchEmailValue(value);
  }, 200);

  const handleChangeValueSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchEmailValue(e.target.value);
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(selectedItem.selected); // Cập nhật state ngay lập tức
    navigate(newPage > 1 ? `/customer-manage/page/${newPage}` : `/customer-manage`, {
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

        <Link to={"/customer-manage/add"} className={styles["btn-add"]}>
          Thêm khách hàng
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
            {customerData.map((customer, index) => (
              <tr key={index}>
                <td
                  className={styles["user-id"]}
                  onClick={() => customer.id && handleRedirectDetail(customer.id)}
                >
                  {index + 1 + currentPage * ITEMS_PER_PAGE}
                </td>
                <td>{customer.email}</td>
                <td>
                  <DefaultImage src={customer.urlImg} />
                </td>
                <td>{customer.fullName}</td>
                <td>{customer.phone}</td>
                <td>{dateTimeTransform(customer.dateBirth, "DD/MM/YYYY", false)}</td>
                <td>
                  <div className={styles["btn-list"]}>
                    <Link
                      to={`${urlMain}/detail/${customer.id}`}
                      className={`${styles["btn-detail"]} ${styles.btn}`}
                    >
                      Chi tiết
                    </Link>
                    <Link
                      to={`${urlMain}/update/${customer.id}`}
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

export default ManageCustomer;
