import { useEffect, useRef, useState } from "react";
import styled from "../styles/inputDropDownList.module.scss";
import { removeDiacritics } from "../utils/removeDiacritics";
import Input from "./Input";
import CustomModal from "./CustomModal";
import DropDownListCD from "./DropDownListCD";
import { useQueryClient } from "@tanstack/react-query";

interface ItemType {
  id: number;
  value: string;
}

interface Props {
  idHTML?: string;
  titleModal:  string;
  list: ItemType[];
  contentPlaceholder?: string;
  valueIn?: string;
  onSelected?: (selected: string) => void;
  onChangeValue?: (value: string) => void;
  onAddItem?: (value: string) => void;
  funcAddItem: (newValue: { newValue: string }) => Promise<object>;
  funcDelItem: (idDelete: number) => Promise<object>;
}

const InputDropDownListCD: React.FC<Props> = ({
  idHTML,
  titleModal,
  list,
  contentPlaceholder = "",
  valueIn = "",
  onSelected,
  onChangeValue,
  funcAddItem,
  funcDelItem,
}) => {
  const queryClient = useQueryClient();
  const [value, setValue] = useState<string>(valueIn);
  const [valueList, setValueList] = useState<ItemType[]>(list);
  const [isDropDownVisible, setIsDropDownVisible] = useState<boolean>(false);
  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const [itemDelete, setItemDelete] = useState<ItemType | null>();
  const [newItemValue, setNewItemValue] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropDownListRef = useRef<HTMLDivElement>(null);

  const handleOnChange = (value: string) => {
    setIsDropDownVisible(true);
    if (onChangeValue) onChangeValue(value);
    const queryFilter = removeDiacritics(value.toLocaleLowerCase().trim());
    setValue(value);
    if (!value) {
      setValueList(list);
    } else {
      const valueFiltered = list.filter((item) =>
        removeDiacritics(item.value.toLowerCase()).includes(queryFilter)
      );
      setValueList(valueFiltered);
    }
  };

  const handleSelected = (value: string) => {
    setValue(value);
    onSelected?.(value);
    if (isModalCreateVisible) {
      setIsDropDownVisible(true);
    }
    setIsDropDownVisible(false);
  };

  const handleFocus = () => {
    inputRef.current?.select();
    setIsDropDownVisible(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextFocus = event.relatedTarget as Node;
    if (
      !containerRef.current?.contains(nextFocus) &&
      !dropDownListRef.current?.contains(nextFocus)
    ) {
      setIsDropDownVisible(false);
    }
  };

  const handleAddNew = () => {
    setIsModalCreateVisible(true);
    setIsDropDownVisible(false);
  };

  const handleAddConfirm = async () => {
    if (newItemValue.trim()) {
      await funcAddItem?.({ newValue: newItemValue.trim() });
      setNewItemValue("");
      setIsModalCreateVisible(false);

      queryClient.invalidateQueries({ queryKey: ["locations"] });
    }
  };

  const handleDelete = (iDelete: ItemType) => {
    setItemDelete(iDelete);
    setIsModalDeleteVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemDelete) {
      await funcDelItem(itemDelete.id);
      setItemDelete(null);
      setIsModalDeleteVisible(false);

      queryClient.invalidateQueries({ queryKey: ["locations"] });
    }
  };

  useEffect(() => {
    setValue(valueIn);
  }, [valueIn]);

  useEffect(() => {
    setValueList(list);
  }, [list]);

  return (
    <>
      <div
        ref={containerRef}
        className={`${styled["input-drop-list"]}`}
        onBlur={handleBlur}
        onFocus={handleFocus}
        tabIndex={-1}
      >
        <div className={`${styled["input-wrapper"]}`}>
          <Input
            idHTML={idHTML}
            ref={inputRef}
            type="text"
            value={value}
            onValueChange={handleOnChange}
            placeholder={contentPlaceholder}
          />
        </div>
        {isDropDownVisible && (
          <div ref={dropDownListRef} className={styled["drop-down-list"]}>
            <DropDownListCD
              list={valueList}
              onSelected={handleSelected}
              onAddNew={handleAddNew}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>
      {/* Create */}
      <CustomModal
        open={isModalCreateVisible}
        title={`Thêm ${titleModal}`}
        onCancel={() => setIsModalCreateVisible(false)}
        footer={[
          <button
            key="cancel"
            className={`${styled["btn-cancel"]} ${styled.btn}`}
            onClick={() => setIsModalCreateVisible(false)}
          >
            Hủy
          </button>,
          <button
            type="button"
            className={`${styled["btn-confirm"]} ${styled.btn}`}
            onClick={handleAddConfirm}
          >
            Xác nhận
          </button>,
        ]}
      >
        <input
          className={styled.input}
          value={newItemValue}
          onChange={(e) => setNewItemValue(e.target.value)}
          placeholder={`Thêm mới ${titleModal} tại đây ...`}
        />
      </CustomModal>
      {/* Delete */}
      <CustomModal
        open={isModalDeleteVisible}
        title={`Xóa ${titleModal}`}
        onCancel={() => setIsModalDeleteVisible(false)}
        footer={[
          <button
            key="cancel"
            className={`${styled["btn-cancel"]} ${styled.btn}`}
            onClick={() => setIsModalDeleteVisible(false)}
          >
            Hủy
          </button>,
          <button
            type="button"
            className={`${styled["btn-confirm"]} ${styled.btn}`}
            onClick={handleDeleteConfirm}
          >
            Xác nhận
          </button>,
        ]}
      >
        {itemDelete && <input className={styled.input} value={itemDelete.value ?? null} readOnly />}
      </CustomModal>
    </>
  );
};

export default InputDropDownListCD;
