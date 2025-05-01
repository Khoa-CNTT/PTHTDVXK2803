import { useEffect, useRef, useState } from "react";
import styled from "../styles/inputDropDownList.module.scss";
import { removeDiacritics } from "../utils/removeDiacritics";
import DropDownList from "./DropDownList";
import Input from "./Input";

interface Props {
  searchTitle?: string;
  idHTML?: string;
  list: string[];
  contentPlaceholder?: string;
  valueIn?: string;
  location?: string;
  onSelected?: (selected: string) => void; //  Định nghĩa kiểu prop
  onChangeValue?: (value: string) => void;
}

const InputDropDownList: React.FC<Props> = ({
  idHTML,
  list,
  contentPlaceholder = "",
  valueIn = "",
  onSelected, //  Thêm prop để truyền giá trị ra ngoài
  onChangeValue,
}) => {
  const [value, setValue] = useState<string>(valueIn);
  const [valueList, setValueList] = useState<string[]>(list);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropDownListRef = useRef<HTMLDivElement>(null);
  const [isDropDownVisible, setIsDropDownVisible] = useState<boolean>(false);

  const handleOnChange = (value: string) => {
    setIsDropDownVisible(true);
    if (onChangeValue) {
      onChangeValue(value);
    }
    const queryFilter = removeDiacritics(value.toLocaleLowerCase().trim());
    setValue(value);
    if (!value) {
      setValueList(list);
    } else {
      const valueFiltered = list.filter((item) => {
        return removeDiacritics(item.toLowerCase()).includes(queryFilter);
      });
      setValueList(valueFiltered);
    }
  };

  const handleSelected = (value: string) => {
    setValue(value);
    if (value && onSelected) {
      //  If component father function transmission
      onSelected(value);
      setIsDropDownVisible(false);
    }
  };

  const handleFocus = () => {
    inputRef.current?.select();
    setIsDropDownVisible(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (
      isDropDownVisible &&
      !containerRef.current?.contains(event.relatedTarget as Node) &&
      !dropDownListRef.current?.contains(event.relatedTarget as Node)
    ) {
      setIsDropDownVisible(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    setValue(valueIn);
  }, [valueIn]);

  return (
    <div
      ref={containerRef}
      className={`${styled["input-drop-list"]}`}
      // onMouseOut={handleOnMouseOut}
      onBlur={handleBlur}
      onFocus={handleFocus}
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
          <DropDownList list={valueList} onSelected={handleSelected} />
        </div>
      )}
    </div>
  );
};

export default InputDropDownList;
