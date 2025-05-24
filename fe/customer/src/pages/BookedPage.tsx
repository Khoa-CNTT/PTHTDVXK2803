import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";
import CustomModal from "../components/CustomModal";
import Loading from "../components/Loading";
import PaymentType from "../components/PaymentType";
import { SeatType } from "../components/Seat";
import SeatMapNormal from "../components/SeatMapNormal";
import SeatMapSleeper from "../components/SeatMapSleeper";
import { createTicket, deleteTicket } from "../services/ticket.service";
import { detailTripBooked, getLocations } from "../services/trip.service";
import { useUserStore } from "../store/userStore";
import styles from "../styles/bookedPage.module.scss";
import { ParamsSearchDetailTrip } from "../types/trip";
import { User } from "../types/user";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";

const defaultQuery: ParamsSearchDetailTrip = {
  from: { id: 0, name: "" },
  to: { id: 0, name: "" },
  start_day: "",
  start_hours: "",
  end_day: "",
  end_hours: "",
  license_plate: "",
};

export interface FormDataTicket {
  ticketId: number;
  tripId: number;
  user: User;
  seats: SeatType[];
  price: number;
}

const BookedPage = () => {
  const [searchTripParams] = useSearchParams();
  const { user } = useUserStore();
  const [querySearchTrip, setQuerySearchTrip] = useState<ParamsSearchDetailTrip>(defaultQuery);
  const [isReadyGetTrip, setIsReadyGetTrip] = useState(false);
  const [isOpenPaymenTypeModal, setIsOpenPaymenTypeModal] = useState<boolean>(false);
  const [formDataTicket, setFormDataTicket] = useState<FormDataTicket>();

  const { data: locationData } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getLocations(),
    staleTime: 60 * 60 * 1000,
    placeholderData: [],
  });

  const { data: tripData, isLoading: isLoadingTrip } = useQuery({
    queryKey: ["trip", querySearchTrip],
    queryFn: () =>
      detailTripBooked({
        from: querySearchTrip.from.id,
        to: querySearchTrip.to.id,
        start_day: querySearchTrip.start_day,
        start_hours: querySearchTrip.start_hours,
        end_day: querySearchTrip.end_day,
        end_hours: querySearchTrip.end_hours,
        license_plate: querySearchTrip.license_plate,
      }),
    staleTime: 60 * 60 * 1000,
    enabled: isReadyGetTrip,
    refetchOnWindowFocus: false,
  });

  // Khi locationData và search params sẵn sàng thì map vào query
  useEffect(() => {
    if (locationData && !locationData.length) return;

    const fromName = searchTripParams.get("from") || "";
    const toName = searchTripParams.get("to") || "";
    const start_day = searchTripParams.get("start_day") || "";
    const start_hours = searchTripParams.get("start_hours") || "";
    const end_day = searchTripParams.get("end_day") || "";
    const end_hours = searchTripParams.get("end_hours") || "";
    const license_plate = searchTripParams.get("license_plate") || "";

    const fromLocation = locationData && locationData.find((l) => l.name === fromName);
    const toLocation = locationData && locationData.find((l) => l.name === toName);

    setQuerySearchTrip({
      from: { id: fromLocation?.id || 0, name: fromName },
      to: { id: toLocation?.id || 0, name: toName },
      start_day,
      start_hours,
      end_day,
      end_hours,
      license_plate,
    });

    setIsReadyGetTrip(true);
  }, [locationData, searchTripParams]);

  useEffect(() => {
    if (user && tripData) {
      setFormDataTicket((prev) =>
        prev
          ? {
              ...prev,
              user: {
                ...prev.user,
                id: user?.id,
              },
              tripId: tripData.id,
            }
          : {
              ticketId: 0,
              tripId: tripData.id,
              seats: [],
              price: 0,
              user: {
                id: user.id,
                email: "",
                fullName: "",
                phone: "",
              },
            }
      );
    }
  }, [user, tripData]);

  useEffect(() => {
    if (formDataTicket && tripData) {
      setFormDataTicket((prev) => ({
        ...prev!,
        price: formDataTicket.seats.length * Number(tripData.price),
      }));
    }
  }, [formDataTicket?.seats, tripData]);

  const handleSelectedSeats = (seatsSelected: SeatType[]) => {
    setFormDataTicket((prev) => (prev ? { ...prev, seats: seatsSelected } : prev));
  };

  const handleChangeValueUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const { name, value } = e.target;
    setFormDataTicket((prev) =>
      prev
        ? {
            ...prev,
            user: {
              ...prev.user,
              [name]: value,
            },
          }
        : prev
    );
  };

  const handlePayment = async () => {
    if ((formDataTicket?.seats?.length ?? 0) <= 0) {
      toast.warning("Bạn chưa chọn bất kỳ ghế nào");
      return;
    } else if (
      formDataTicket?.user.email === "" ||
      formDataTicket?.user.fullName === "" ||
      formDataTicket?.user.phone === ""
    ) {
      toast.warning("Bạn chưa nhập thông tin người sẽ nhận vé");
    } else {
      if (formDataTicket) {
        const responseTicket = await createTicket(formDataTicket);
        if (responseTicket.ticket) {
          setFormDataTicket((prev) => (prev ? { ...prev, ticketId: responseTicket.ticket } : prev));
          setIsOpenPaymenTypeModal(true);
        } else {
          toast.warning("Thanh toán thất bại");
          return;
        }
      } else {
        toast.warning("Bạn chưa có đầy đủ thông tin");
        return;
      }
    }
  };

  const handleCloseModalPayment = async () => {
    if (formDataTicket?.ticketId) {
      const response = await deleteTicket(formDataTicket?.ticketId);
      if (response.status === "OK") {
        setIsOpenPaymenTypeModal(false);
      } else {
        toast.warning("Lỗi TK(500)");
      }
    }
  };

  return (
    <>
      {tripData && !isLoadingTrip ? (
        <div className={styles["booked-container"]}>
          <div className={styles["booked-left"]}>
            <div className={styles["booked-seats"]}>
              <div className={styles["booked-seats__info"]}>
                {tripData.car.type === "xe thường" ? (
                  <SeatMapNormal initialSeats={tripData.seats} onSelected={handleSelectedSeats} />
                ) : (
                  <SeatMapSleeper initialSeats={tripData.seats} onSelected={handleSelectedSeats} />
                )}
              </div>
              <div className={styles["booked-seats__description"]}>
                <div className={styles["booked-seats__description-status"]}>
                  <div
                    className={`${styles["booked-seats__description-status__color"]} ${styles.unavailable}`}
                  ></div>
                  <div className={styles["booked-seats__description-status__content"]}>Đã bán</div>
                </div>
                <div className={styles["booked-seats__description-status"]}>
                  <div
                    className={`${styles["booked-seats__description-status__color"]} ${styles.available}`}
                  ></div>
                  <div className={styles["booked-seats__description-status__content"]}>
                    Còn trống
                  </div>
                </div>
                <div className={styles["booked-seats__description-status"]}>
                  <div
                    className={`${styles["booked-seats__description-status__color"]} ${styles.selecting}`}
                  ></div>
                  <div className={styles["booked-seats__description-status__content"]}>
                    Đang chọn
                  </div>
                </div>
              </div>
            </div>
            {/*  */}
            <div className={styles["booked-user"]}>
              <div className={styles["booked-user__info"]}>
                <p className={styles["booked-user__info-title"]}>Thông tin khách hàng</p>
                <div className={styles["recipient-info"]}>
                  <label htmlFor="fullName" className={styles["label"]}>
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className={styles["input"]}
                    value={formDataTicket?.user.fullName ?? ""}
                    onChange={handleChangeValueUser}
                  />
                </div>
                <div className={styles["recipient-info"]}>
                  <label htmlFor="phone" className={styles["label"]}>
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="phone"
                    className={styles["input"]}
                    value={formDataTicket?.user.phone ?? ""}
                    pattern="0+[0-9]{10}"
                    onChange={handleChangeValueUser}
                  />
                </div>
                <div className={styles["recipient-info"]}>
                  <label htmlFor="email" className={styles["label"]}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={styles["input"]}
                    value={formDataTicket?.user.email ?? ""}
                    pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                    onChange={handleChangeValueUser}
                  />
                </div>
              </div>
              <div className={styles["booked-user__note"]}>
                <p className={styles["booked-user__note-title"]}>Lưu ý</p>
                <div className={styles["booked-user__note-info"]}>
                  <p>
                    Vui lòng nhập cá trường bên trái, chúng tôi sẽ lưu những thông tin này vào vé
                    của bạn{" "}
                  </p>
                </div>
              </div>
            </div>
            {/*  */}
            <div className={styles["booked-payment"]}>
              <p className={styles["total-price"]}>{formatCurrency(formDataTicket?.price || 0)}</p>
              <button type="button" className={styles["btn-payment"]} onClick={handlePayment}>
                Thanh toán
              </button>
            </div>
          </div>
          <div className={styles["booked-right"]}>
            <div className={styles["booked-info"]}>
              <p className={styles["booked-info__title"]}>Thông Tin chi tiết</p>
              <div className={styles["booked-info__route"]}>
                <p>Tuyến đường</p>
                <p>{`${tripData?.departure.name} - ${tripData?.arrival.name}`}</p>
              </div>
              <div className={styles["booked-info__time"]}>
                <p>Thời gian xuất bến</p>
                <p>{formatDate(tripData?.startTime, "DD-MM-YYYY-HH:mm", false)}</p>
              </div>
              <div className={styles["booked-info__item"]}>
                <p>Số lượng ghế</p>
                <p>{formDataTicket?.seats.length}</p>
              </div>
              <div className={styles["booked-info__item"]}>
                <p>Số ghế</p>
                <p>{formDataTicket?.seats.map((s) => s.position).join(" ")}</p>
              </div>
              <div className={styles["booked-info__item"]}>
                <p>Tổng tiền lượt đi</p>
                <p>{formatCurrency(formDataTicket?.price || 0)}</p>
              </div>
            </div>

            <div className={styles["booked-detail-price"]}>
              <div className={styles["booked-detail-price__title"]}>
                <p>Chi tiết giá</p>
                <FontAwesomeIcon
                  className={styles["booked-detail-price__title-ic"]}
                  icon={faCircleExclamation}
                />
              </div>
              <div className={styles["booked-detail-price__title"]}>
                <p>Giá vé lượt đi</p>
                <p className={styles.price}>{formatCurrency(formDataTicket?.price || 0)}</p>
              </div>
              <div className={styles["booked-detail-price__title"]}>
                <p>Phí thanh toán</p>
                <p className={styles.price}>0</p>
              </div>
              <span className={styles.dash}></span>
              <div className={styles["booked-detail-price__title"]}>
                <p>Tổng tiền</p>
                <p className={styles.price}>{formatCurrency(formDataTicket?.price || 0)}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
      <CustomModal
        onCancel={handleCloseModalPayment}
        open={isOpenPaymenTypeModal}
        title={"Chọn phương thức thanh toán"}
      >
        {formDataTicket ? (
          <PaymentType
            valueIn={formDataTicket}
            onCloseModalPaymentType={() => setIsOpenPaymenTypeModal(false)}
          />
        ) : null}
      </CustomModal>
    </>
  );
};

export default BookedPage;
