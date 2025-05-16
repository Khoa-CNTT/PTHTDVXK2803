import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import styles from "../../styles/manageTrip.module.scss";
import { ArrangeType } from "../../types/type";
import { dateTimeTransform } from "../../utils/transform";
import { getAllTrip } from "../../services/trip.service";
import formatCurrency from "../../utils/formatCurrency";
import { debounce } from "../../utils/debounce";

const ITEMS_PER_PAGE = 10;

const TripManage: React.FC = () => {
  const navigate = useNavigate();
  const { page } = useParams<{ page?: string }>();
  const location = useLocation();
  const [arrangeType, setArrangeType] = useState<ArrangeType>("desc");
  const [currentPage, setCurrentPage] = useState<number>(
    page ? Math.max(1, parseInt(page, 10)) - 1 : 0
  );
  const [valueSearch, setValueSearch] = useState<string>("");
  const urlMain = "/trip-manage";

  // Khi URL thay đổi, cập nhật currentPage
  useEffect(() => {
    const pageNum = page ? Math.max(1, parseInt(page, 10)) - 1 : 0;
    setCurrentPage(pageNum);
  }, [location.pathname]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["trips", currentPage, arrangeType, valueSearch],
    queryFn: () =>
      getAllTrip({
        offset: currentPage * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        arrangeType: arrangeType,
        licensePlateSearch: valueSearch,
      }),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const total = data?.total ?? 0;
  const tripData = data?.data || [];

  const toggleArrangeType = () => {
    setArrangeType((prevArrangeType) => (prevArrangeType === "asc" ? "desc" : "asc"));
  };

  const handleChangeValueSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setValueSearch(e.target.value);
  }, 200);

  const handlePageClick = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(selectedItem.selected); // Cập nhật state ngay lập tức
    navigate(newPage > 1 ? `/trip-manage/page/${newPage}` : `/trip-manage`, {
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

        <Link to={"/trip-manage/add"} className={styles["btn-add"]}>
          Thêm chuyến mới
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
              <th>Tên chuyến </th>
              <th>Biển số xe</th>
              <th>Tài xế</th>
              <th>Điểm đi</th>
              <th>Thời gian khởi hành</th>
              <th>Điểm đến</th>
              <th>Thời gian kết thúc</th>
              <th>Số ghế còn trống</th>
              <th>Số ghế đã đặt</th>
              <th>Giá cho mỗi ghế</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {tripData.map((trip, index) => (
              <tr key={index}>
                <td
                  className={styles["field-id"]}
                  onClick={() => trip.id && handleRedirectDetail(trip.id)}
                >
                  {index + 1 + currentPage * ITEMS_PER_PAGE}
                </td>
                <td>{trip.tripName}</td>
                <td>{trip.licensePlate}</td>
                <td>{trip.driverName}</td>
                <td>{trip.departureLocation}</td>
                <td>{dateTimeTransform(trip.startTime, "DD/MM/YYYY", true)}</td>
                <td>{trip.arrivalLocation}</td>
                <td>{dateTimeTransform(trip.endTime, "DD/MM/YYYY", true)}</td>
                <td>{trip.totalSeatAvailable}</td>
                <td>{trip.totalSeatBooked}</td>
                <td>{formatCurrency(trip.price)}</td>
                <td>
                  <div className={styles["actions"]}>
                    <Link
                      to={`${urlMain}/detail/${trip.id}`}
                      className={`${styles["btn-detail"]} ${styles.btn}`}
                    >
                      Chi tiết
                    </Link>
                    {trip.totalSeatBooked > 0 ? null : (
                      <Link
                        to={`${urlMain}/update/${trip.id}`}
                        className={`${styles["btn-edit"]} ${styles.btn}`}
                      >
                        Cập nhật
                      </Link>
                    )}
                    {trip.totalSeatBooked > 0 ? null : (
                      <button className={`${styles["btn-delete"]} ${styles.btn}`}>Xóa</button>
                    )}
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

export default TripManage;
