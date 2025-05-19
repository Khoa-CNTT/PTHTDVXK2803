import { useNavigate, useSearchParams } from "react-router-dom";
import SearchTrip from "../components/SearchTrip";
import { useEffect, useState } from "react";
import SortTrip from "../components/SortTrip";
import { useQuery } from "@tanstack/react-query";
import { ParamsSearchTrip, TripInfoBase } from "../types/trip";
import { getLocations, searchTrips } from "../services/trip.service";
import Loading from "../components/Loading";
import styles from "../styles/searchTripPage.module.scss";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
import IconDeparture from "../components/IconDeparture";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const ITEMS_PER_PAGE = 10;

const SearchTripPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchParamsValue, setSearchParamsValue] = useState<ParamsSearchTrip>({
    from: { id: 0, name: "" },
    to: { id: 0, name: "" },
    start_time: "",
    sort: "",
  });

  useEffect(() => {
    const today = new Date();
    const defaultDate = today.toISOString().split("T")[0];

    setSearchParamsValue((prev) => {
      const fromName = searchParams.get("from") || "Đà Nẵng";
      const fromLocation = locationData?.find((l) => l.name === fromName);
      const toName = searchParams.get("to") || "Hồ Chí Minh";
      const toLocation = locationData?.find((l) => l.name === toName);

      return {
        ...prev,
        from: { id: fromLocation?.id || 0, name: fromName },
        to: { id: toLocation?.id || 0, name: toName },
        start_time: searchParams.get("start_time") || defaultDate,
        sort: searchParams.get("sort") || "default",
      };
    });
  }, [searchParams]);

  const { data: locationData } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getLocations(),
    staleTime: 60 * 60 * 1000,
  });

  const {
    data: tripsData,
    isLoading: isTripLoading,
    isError: isTripError,
  } = useQuery({
    queryKey: ["trips", searchParamsValue],
    queryFn: () =>
      searchTrips({
        from: searchParamsValue.from.id,
        to: searchParamsValue.to.id,
        start_time: searchParamsValue.start_time,
        sort: searchParamsValue.sort || "",
        limit: ITEMS_PER_PAGE,
        offset: 0,
      }),
    staleTime: 60 * 60 * 1000,
  });

  const handleChangeSortValue = (sortValue: string) => {
    setSearchParamsValue((prev) => ({ ...prev, sort: sortValue }));

    const newParams = new URLSearchParams(searchParams);
    if (sortValue === "default") {
      newParams.delete("sort");
      setSearchParams(newParams);
    } else {
      newParams.set("sort", sortValue);
      setSearchParams(newParams);
    }
  };

  const hanleDetailTrip = (trip: TripInfoBase) => {
    navigate(
      `/dat-ve?license_plate=${trip.licensePlate}&from=${trip.departure}&to=${trip.arrival}&start_time=${trip.startTime}&end_time=${trip.endTime}`
    );
  };

  return (
    <div className={styles["search-trip-page-wrapper"]}>
      <div className={styles["search-trip-cpn-wrapper"]}>
        <SearchTrip valueSearchIn={searchParamsValue} />
      </div>
      <div className={styles["search-trip"]}>
        <div className={styles["sort-filtered-container"]}>
          <div className={styles["sort-wrapper"]}>
            <SortTrip
              onchange={handleChangeSortValue}
              valueIn={searchParamsValue.sort ?? "default"}
            />
          </div>
          <div className={styles["sort-filtered-container"]} hidden>
            <div className={styles["filtered-wrapper"]}>filter</div>
          </div>
        </div>

        {isTripError && <p>Lỗi tìm kiếm chuyến đi</p>}
        {tripsData && !isTripLoading ? (
          <div className={styles["result-search-trip-info"]}>
            <div className={styles["result-total-trips"]}>
              <p className={styles["label"]}>Kết quả:</p>
              <p className={styles["result"]}>{tripsData?.total}</p>
            </div>
            <div className={styles["result-search-trips"]}>
              {tripsData.data &&
                tripsData.data.map((t, index) => (
                  <div key={`${t.id}-${index}`} className={styles["result-search-trip__item"]}>
                    <div className={styles["result-search-container"]}>
                      <div className={styles["img-trip"]}>
                        <img
                          src={t.image}
                          alt={`img-${t.id}`}
                          loading="lazy"
                          className={styles.image}
                        />
                      </div>
                      <div className={styles["info-trip"]}>
                        <div className={styles["info-trip__title"]}>
                          <p className={styles["info-trip__title-name"]}>{t.tripName}</p>
                          <p className={styles["info-trip__title-price"]}>
                            {formatCurrency(Number(t.price))}
                          </p>
                        </div>
                        <div className={styles["info-trip__detail"]}>
                          <div className={styles["info-trip__detail-ic-from-to"]}>
                            <IconDeparture />
                            <div className={styles.dash}>
                              <span>.........</span>
                            </div>
                            <FontAwesomeIcon
                              className={`${styles.ic} ${styles["ic-departure"]}`}
                              icon={faLocationDot}
                            />
                          </div>
                          <div className={styles["info-trip__detail-hour-location"]}>
                            <div className={styles["info-trip__detail-hour"]}>
                              <p>
                                {formatDate(t.startTime, "DD-MM-YYYY-HH:mm", false).split(" ")[0]}
                              </p>
                              <p>
                                {formatDate(t.endTime, "DD-MM-YYYY-HH:mm", false).split(" ")[0]}
                              </p>
                            </div>
                            <div className={styles["info-trip__detail-location"]}>
                              <p>{t.departure}</p>
                              <p>{t.arrival}</p>
                            </div>
                          </div>
                          <div className={styles["info-trip__detail-and-actions"]}>
                            <p>{`Còn ${t.totalSeatAvailable} chỗ trống`}</p>
                            <button
                              type="button"
                              className={styles["btn-detail-trip"]}
                              onClick={() => hanleDetailTrip(t)}
                            >
                              Xem chuyến
                            </button>
                          </div>
                        </div>
                        <div className={styles["notify-trip"]}>
                          <p>Vé chặng thuộc chuyến</p>
                          <p>{`${formatDate(t.startTime, "DD-MM-YYYY-HH:mm")}`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default SearchTripPage;
