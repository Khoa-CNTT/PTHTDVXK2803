import { Radio, RadioChangeEvent } from "antd";
import styles from "../styles/sortTrip.module.scss";
import { useEffect, useState } from "react";

interface SortTripProps {
  valueIn: string;
  onchange: (changeValue: string) => void;
}

const SortTrip: React.FC<SortTripProps> = ({ valueIn, onchange }) => {
  const [sortValue, setSortValue] = useState<string>(valueIn || "Mặc định");

  const handleChangeSortValue = (e: RadioChangeEvent) => {
    e.preventDefault();
    const value = e.target.value;
    setSortValue(value);
    onchange(value);
  };

  useEffect(() => {
    setSortValue(valueIn);
  }, [valueIn]);

  return (
    <div className={styles["sort-trip-container"]}>
      <Radio.Group
        className={styles["radio-group"]}
        defaultValue={"Mặc định"}
        onChange={handleChangeSortValue}
        value={sortValue}
      >
        <Radio className={styles["radio-item"]} name="sort-trip" value={"default"} defaultChecked>
          Mặc định
        </Radio>
        <Radio className={styles["radio-item"]} name="sort-trip" value={"time-asc"}>
          Giờ đi sớm nhất
        </Radio>
        <Radio className={styles["radio-item"]} name="sort-trip" value={"time-desc"}>
          Giờ đi muộn nhất
        </Radio>
        <Radio className={styles["radio-item"]} name="sort-trip" value={"price-asc"}>
          Giá tăng dần
        </Radio>
        <Radio className={styles["radio-item"]} name="sort-trip" value={"price-desc"}>
          Giá giảm dần
        </Radio>
        <Radio className={styles["radio-item"]} name="sort-trip" value={"rating-desc"}>
          Đánh giá cao nhất
        </Radio>
      </Radio.Group>
    </div>
  );
};

export default SortTrip;
