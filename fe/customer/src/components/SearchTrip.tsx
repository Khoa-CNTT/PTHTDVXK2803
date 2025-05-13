import { useState } from "react";
import InputDropDownList from "./InputDropDownList";
import styles from "../styles/searchTrip.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons";
import DateInput from "./DateInput";

const SearchTrip = () => {
  const arr = [
    "Đà Nẵng",
    "Quãng Nam",
    "Quãng Ngãi",
    "Huế",
    "Quãng Bình",
    "Hà Nội",
    "Hồ Chí Minh",
    "Vũng Tàu",
    "Hải Phòng",
    "Cà Mau",
  ];

  const [departureValue, setDepartureValue] = useState<string>("Đà Nẵng");
  const [destinationValue, setDestinationValue] = useState<string>("Huế");

  const handleDepartureLocationSelected = (locationSelected: string) => {
    setDepartureValue(locationSelected);
  };

  const handleDestinationLocationSelected = (locationSelected: string) => {
    setDestinationValue(locationSelected);
  };

  const handleDepartureChangeValue = (departureValue: string) => {
    setDepartureValue(departureValue);
  };

  const handleDestinationChangeValue = (destinationValue: string) => {
    setDestinationValue(destinationValue);
  };

  const handleSwapLocation = () => {
    const depTemp = departureValue;
    const desTemp = destinationValue;
    setDepartureValue(desTemp);
    setDestinationValue(depTemp);
  };

  return (
    <form className={styles["search-trip"]}>
      <div className={`${styles["search-trip-left"]}`}>
        <div className={styles.item}>
          <InputDropDownList
            list={arr}
            location={"departure"}
            contentPlaceholder={"Điểm đi"}
            searchTitle={"Nơi xuất phát"}
            valueIn={departureValue}
            onSelected={handleDepartureLocationSelected}
            onChangeValue={handleDepartureChangeValue}
          />
        </div>
        <div className={`${styles.item} ${styles["item-full"]}`}>
          <FontAwesomeIcon
            className={styles["ic-r-l"]}
            icon={faRightLeft}
            onClick={handleSwapLocation}
          />
        </div>
        <div className={styles.item}>
          <InputDropDownList
            list={arr}
            location="destination"
            contentPlaceholder={"Điểm đến"}
            searchTitle={"Nơi đến"}
            valueIn={destinationValue}
            onSelected={handleDestinationLocationSelected}
            onChangeValue={handleDestinationChangeValue}
          />
        </div>
        <div className={styles.item}>
          <DateInput title="Ngày đi" />
        </div>
      </div>
      <div className={`${styles["search-trip-right"]}`}>
        <button className={styles["btn-search-trip"]} type="submit">
          Tìm kiếm
        </button>
      </div>
    </form>
  );
};

export default SearchTrip;
