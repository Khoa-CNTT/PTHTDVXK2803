import React from "react";
import styles from "../styles/filterCheckbox.module.scss";

interface Props {
  title: string;
  types: string[];
  selectedTypes: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilterCheckbox: React.FC<Props> = ({ title, types, selectedTypes, onChange }) => {
  return (
    <div className={styles["filter-type"]}>
      <p className={styles["type-title"]}>{title}:</p>
      {types.map((type) => (
        <div key={type} className={styles["type-item"]}>
          <input
            className={styles.checkbox}
            type="checkbox"
            id={type}
            value={type}
            checked={selectedTypes.includes(type)}
            onChange={onChange}
          />
          <label htmlFor={type}>{type}</label>
        </div>
      ))}
    </div>
  );
};

export default FilterCheckbox;
