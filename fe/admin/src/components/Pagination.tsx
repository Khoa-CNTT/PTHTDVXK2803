import React from "react";
import ReactPaginate from "react-paginate";
import styles from "../styles/pagination.module.scss"; // SCSS Module

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, onPageChange, currentPage }) => {
  return (
    <ReactPaginate
      className={styles.pagination}
      breakLabel="..."
      nextLabel=">"
      onPageChange={onPageChange}
      pageRangeDisplayed={3}
      pageCount={pageCount}
      previousLabel="<"
      renderOnZeroPageCount={null}
      activeClassName={styles.selected}
      disabledClassName={styles.disabled}
      forcePage={currentPage} // Giữ đồng bộ currentPage
    />
  );
};

export default Pagination;
