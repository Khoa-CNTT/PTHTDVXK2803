import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import styled from "../styles/dateInput.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useEffect, useState } from "react";

interface DateInputProps {
  title: string;
  valueIn?: string;
  onChange: (time: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ title, valueIn, onChange }) => {
  const [dateValue, setDateValue] = useState<string>("");

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value;
    setDateValue(newTime);
    onChange(newTime);
  };

  useEffect(() => {
    if (valueIn) {
      setDateValue(valueIn);
    } else {
      const today = new Date();
      const formatterDate = today.toISOString().split("T")[0];
      setDateValue(formatterDate);
      onChange(formatterDate);
    }
  }, [valueIn]);

  return (
    <div className={styled["date-input-container"]}>
      <div className={styled["ic-date"]}>
        <FontAwesomeIcon className={styled.ic} icon={faCalendarDay} />
      </div>
      <div className={styled["date-input"]}>
        <label className={styled.title}>{title}</label>
        <input
          type="date"
          name="date-departure"
          id="date"
          className={styled["date-departure"]}
          value={dateValue}
          onClick={(e) => e.currentTarget.showPicker?.()}
          onChange={handleChangeDate}
        />
      </div>
    </div>
  );
};

export default memo(DateInput);
