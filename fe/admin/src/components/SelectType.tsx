import React from "react";
import styles from "../styles/selectType.module.scss";

interface Props {
  selectedType: "all" | "percentage" | "fixed";
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectType: React.FC<Props> = ({ selectedType, onChange }) => {
  return (
    <div className={styles["filter-type"]}>
      <p className={styles["type-title"]}>Kiểu khuyến mãi:</p>
      <select className={styles["select-type"]} value={selectedType} onChange={onChange}>
        <option value="all">Tất cả</option>
        <option value="percentage">Phần trăm</option>
        <option value="fixed">Giá cố định</option>
      </select>
    </div>
  );
};

export default SelectType;
