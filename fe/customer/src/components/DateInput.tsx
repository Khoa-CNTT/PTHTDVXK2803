import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import styled from "../styles/dateInput.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useEffect, useState } from "react";
import { formatDate } from "../utils/formatDate";

const DateInput = ({ title }: { title: string }) => {
  const [currentDate, setCurrentDate] = useState<string>("");

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDate(event.target.value);
  };

  const handleFocusDateDeparture = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.showPicker?.();
  };

  useEffect(() => {
    const today = new Date();
    const formatterDate = today.toISOString().split("T")[0];
    setCurrentDate(formatterDate);
  }, []);


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
          value={currentDate}
          onFocus={handleFocusDateDeparture}
          onChange={handleChangeDate}
        />
      </div>
    </div>
  );
};

export default memo(DateInput);
