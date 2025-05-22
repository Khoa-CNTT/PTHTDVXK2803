import { FormEvent, useEffect, useState, useRef } from "react";
import InputDropDownList from "./InputDropDownList";
import styles from "../styles/searchTrip.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons";
import DateInput from "./DateInput";
import { getLocations } from "../services/trip.service";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading";
import { useNavigate } from "react-router";
import { ParamsSearchTrips } from "../types/trip";

interface SearchTripType {
  from: string;
  to: string;
  start_time: string;
}


interface SearchTripProps {
  valueSearchIn?: ParamsSearchTrips;
}

const SearchTrip: React.FC<SearchTripProps> = ({ valueSearchIn }) => {
  const navigate = useNavigate();
  const isInternalUpdate = useRef(false);
  const isInitialized = useRef(false);

  const { data: locationData, isLoading: isLocationsLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getLocations(),
    staleTime: 60 * 60 * 1000,
    
  });

  const [searchValue, setSearchValue] = useState<SearchTripType>({
    from: "Đà Nẵng",
    to: "Hồ Chí Minh",
    start_time: new Date().toISOString().split("T")[0],
  });

  const updateSearchValue = (newValues: Partial<SearchTripType>) => {
    isInternalUpdate.current = true;
    setSearchValue((prev) => {
      const updated = { ...prev, ...newValues };
      return updated;
    });
  };

  const handleDepartureLocationSelected = (locationSelected: string) => {
    updateSearchValue({ from: locationSelected });
  };

  const handleDestinationLocationSelected = (locationSelected: string) => {
    updateSearchValue({ to: locationSelected });
  };

  const handleChangeValueDate = (timeValue: string) => {
    updateSearchValue({ start_time: timeValue });
  };

  const handleSwapLocation = () => {
    updateSearchValue({
      from: searchValue.to,
      to: searchValue.from,
    });
  };

  const handleSearchTrip = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    navigate(
      `/tim-kiem?from=${encodeURIComponent(searchValue.from)}&to=${encodeURIComponent(
        searchValue.to
      )}&start_time=${searchValue.start_time}`
    );
  };

  useEffect(() => {
    if (!isInitialized.current) {
      const initialValues: Partial<SearchTripType> = {};
      let hasChanges = false;

      if (valueSearchIn?.from) {
        initialValues.from = valueSearchIn.from.name;
        hasChanges = true;
      }

      if (valueSearchIn?.to) {
        initialValues.to = valueSearchIn.to.name;
        hasChanges = true;
      }

      if (valueSearchIn?.start_time) {
        initialValues.start_time = valueSearchIn.start_time;
        hasChanges = true;
      }

      if (hasChanges) {
        setSearchValue((prev) => ({ ...prev, ...initialValues }));
      }

      isInitialized.current = true;
    }
  }, [valueSearchIn?.from, valueSearchIn?.to, valueSearchIn?.start_time]);

  useEffect(() => {
    if (!isInitialized.current || isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const updatedValues: Partial<SearchTripType> = {};
    let hasChanges = false;

    if (valueSearchIn?.from !== undefined && valueSearchIn?.from.name !== searchValue.from) {
      updatedValues.from = valueSearchIn.from.name;
      hasChanges = true;
    }

    if (valueSearchIn?.to !== undefined && valueSearchIn?.to.name !== searchValue.to) {
      updatedValues.to = valueSearchIn.to.name;
      hasChanges = true;
    }

    if (
      valueSearchIn?.start_time !== undefined &&
      valueSearchIn?.start_time !== searchValue.start_time
    ) {
      updatedValues.start_time = valueSearchIn.start_time;
      hasChanges = true;
    }

    if (hasChanges) {
      setSearchValue((prev) => ({ ...prev, ...updatedValues }));
    }
  }, [
    valueSearchIn?.from,
    valueSearchIn?.to,
    valueSearchIn?.start_time,
    searchValue.from,
    searchValue.to,
    searchValue.start_time,
  ]);
  return (
    <form className={styles["search-trip"]} onSubmit={handleSearchTrip}>
      <div className={`${styles["search-trip-left"]}`}>
        <div className={styles.item}>
          {locationData && !isLocationsLoading ? (
            <InputDropDownList
              name="departure"
              list={locationData?.map((l) => l.name)}
              location={"departure"}
              contentPlaceholder={"Điểm đi"}
              searchTitle={"Nơi xuất phát"}
              valueIn={searchValue.from}
              onSelected={handleDepartureLocationSelected}
              onChangeValue={handleDepartureLocationSelected}
            />
          ) : (
            <Loading />
          )}
        </div>
        <div className={`${styles["item-swap"]}`}>
          <FontAwesomeIcon
            className={styles["ic-swap"]}
            icon={faRightLeft}
            onClick={handleSwapLocation}
          />
        </div>
        <div className={styles.item}>
          {locationData && !isLocationsLoading ? (
            <InputDropDownList
              name="arrival"
              list={locationData?.map((l) => l.name)}
              location="destination"
              contentPlaceholder={"Điểm đến"}
              searchTitle={"Nơi đến"}
              valueIn={searchValue.to}
              onSelected={handleDestinationLocationSelected}
              onChangeValue={handleDestinationLocationSelected}
            />
          ) : (
            <Loading />
          )}
        </div>
        <div className={styles.item}>
          <DateInput
            title="Ngày đi"
            valueIn={searchValue.start_time}
            onChange={handleChangeValueDate}
          />
        </div>
        <div className={`${styles["search-trip-right"]}`}>
          <button className={styles["btn-search-trip"]} type="submit">
            Tìm kiếm
          </button>
        </div>
      </div>
      <div className={styles["search-trip-bottom"]}>
        <div className={styles.title}>
          <h2>Gợi ý tuyến đường</h2>
        </div>
        <div>
          <div className={styles.data}>
            <div className={styles.children}>
              <span className={styles.name}>Đà Nẵng - Hà Nội</span>
              <span className={styles.date}>11-2-2025</span>
            </div>
            <div className={styles.children}>
              <span className={styles.name}>Đà Nẵng - Sài Gòn</span>
              <span className={styles.date}>11-2-2025</span>
            </div>
            <div className={styles.children}>
              <span className={styles.name}>Đà Nẵng - Lâm Đồng</span>
              <span className={styles.date}>11-2-2025</span>
            </div>
            <div className={styles.children}>
              <span className={styles.name}>Đà Nẵng - Hà Nội</span>
              <span className={styles.date}>11-2-2025</span>
            </div>
            <div className={styles.children}>
              <span className={styles.name}>Đà Nẵng - Hà Nội</span>
              <span className={styles.date}>11-2-2025</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchTrip;
