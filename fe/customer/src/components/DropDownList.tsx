import React from "react";
import styled from "../styles/dropDownList.module.scss";
import sortString from "../utils/sortString";

const DropDownList = ({
  list,
  onSelected,
}: {
  list: string[];
  onSelected: (selectLocation: string) => void;
}) => {
  const handleSelect = (event: React.MouseEvent<HTMLLIElement>) => {
    event.preventDefault();
    const valueSelect = event.currentTarget.textContent?.trim();
    if (valueSelect && onSelected) {
      onSelected(valueSelect);
    }
  };

  if (list.length > 0) {
    return (
      <ul className={styled["drop-list"]}>
        {sortString(list).map((item, index) => (
          <li className={styled["drop-item"]} key={index} onMouseDown={handleSelect}>
            <p className={styled.content}>{item}</p>
          </li>
        ))}
      </ul>
    );
  }
};

export default DropDownList;
