import styled from "../styles/dropDownList.module.scss";
import sortString from "../utils/sort";

const DropDownList = ({
  list,
  onSelected,
}: {
  list: string[];
  onSelected: (selectLocation: string) => void;
}) => {
  const handleSelect = (selectedValue: string) => {
    if (selectedValue && onSelected) {
      onSelected(selectedValue);
    }
  };

  if (list.length > 0) {
    return (
      <ul className={styled["select-list"]}>
        {sortString(list).map((item, index) => (
          <li className={styled["select-list-item"]} key={index}>
            <button
              type="button"
              className={styled["select-item-btn"]}
              onClick={() => handleSelect(item)}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    );
  } else {
    return null;
  }
};

export default DropDownList;
