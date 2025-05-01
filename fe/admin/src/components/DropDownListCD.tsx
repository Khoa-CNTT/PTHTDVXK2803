import styled from "../styles/dropDownList.module.scss";
import sortStringO from "../utils/sortStringO";

interface ItemType {
  id: number;
  value: string;
}

const DropDownListCD = ({
  list,
  onSelected,
  onAddNew,
  onDelete,
}: {
  list: ItemType[];
  onSelected: (selectLocation: string) => void;
  onAddNew: () => void;
  onDelete: (itemDelete: ItemType) => void;
}) => {
  const handleSelect = (selectedValue: string) => {
    if (selectedValue) {
      onSelected(selectedValue);
    }
  };

  const handleSelectedDelete = (itemDelete: ItemType) => {
    if (onDelete) {
      onDelete(itemDelete);
    }
  };

  return (
    <ul className={styled["select-list"]}>
      <li className={`${styled["select-list-item"]} ${styled["add-new"]}`}>
        <button
          className={styled["select-item-btn"]}
          onClick={(e) => {
            e.preventDefault();
            onAddNew();
          }}
        >
          --- Thêm mới ---
        </button>
      </li>
      {sortStringO(list, "value").map((item, index) => (
        <li className={styled["select-list-item"]} key={index}>
          <button
            type="button"
            className={styled["select-item-btn"]}
            onMouseDown={() => handleSelect(item.value)}
          >
            {item.value}
          </button>
          <button
            type="button"
            className={styled["btn-remove"]}
            onClick={() => handleSelectedDelete(item)}
          >
            X
          </button>
        </li>
      ))}
    </ul>
  );
};

export default DropDownListCD;
