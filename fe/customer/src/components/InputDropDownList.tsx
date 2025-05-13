import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useEffect, useRef, useState } from "react";
import styled from "../styles/inputDropDownList.module.scss";
import { InputDropDownProps } from "../types/props";
import { removeDiacritics } from "../utils/removeDiacritics";
import DropDownList from "./DropDownList";
import Input from "./Input";
import IconDeparture from "./IconDeparture";

const InputDropDownList: React.FC<InputDropDownProps> = ({
  list,
  contentPlaceholder = "",
  searchTitle = "",
  valueIn = "Đà Nẵng",
  location = "departure",
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
    console.log("selected-Input", value);
    setValue(value);
    if (value && onSelected) {
      //  If component father function transmission
      onSelected(value);
      setIsDropDownVisible(false);
    }
  };

  const handleClick = () => {
    inputRef.current?.select();
    setIsDropDownVisible(true);
  };

  //

  // const handleOnMouseOut = (event: React.MouseEvent<HTMLDivElement>) => {
  //   if (isDropDownVisible) {
  //     if (
  //       !containerRef.current?.contains(event.relatedTarget as Node) &&
  //       !dropDownListRef.current?.contains(event.relatedTarget as Node)
  //     ) {
  //       setIsDropDownVisible(false);
  //       inputRef.current?.blur();
  //     }
  //   }
  // };

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
      className={styled["input-drop-list"]}
      // onMouseOut={handleOnMouseOut}
      onBlur={handleBlur}
      onClick={handleClick}
    >
      <div className={`${styled["input-location"]} d-flex`}>
        <div className={styled["ic-search"]}>
          {location === "departure" ? (
            <IconDeparture />
          ) : (
            <FontAwesomeIcon
              className={`${styled.ic} ${styled["ic-departure"]}`}
              icon={faLocationDot}
            />
          )}
        </div>
        <div className={styled["search-locations"]}>
          <label className={styled.title}>{searchTitle}</label>
          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleOnChange}
            placeholder={contentPlaceholder}
          />
        </div>
      </div>
      {isDropDownVisible && (
        <div ref={dropDownListRef} className={styled["drop-down-list"]}>
          <DropDownList list={valueList} onSelected={handleSelected} />
        </div>
      )}
    </div>
  );
};

export default memo(InputDropDownList);
