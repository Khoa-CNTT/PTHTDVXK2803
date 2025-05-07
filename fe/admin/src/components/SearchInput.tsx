import React from "react";
import styles from "../styles/searchInput.module.scss";

interface Props {
  title?: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<Props> = ({ placeholder, onChange }) => {
  return (
    <div className={styles.search}>
      <input
        type="text"
        placeholder={`${placeholder}...`}
        className={styles["search-input"]}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;
