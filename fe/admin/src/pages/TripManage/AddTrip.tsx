// import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DynamicCoDriverSelect from "../../components/DynamicCoDriverSelect";
import InputDropDownList from "../../components/InputDropDownList";
import InputDropDownListCD from "../../components/InputDropDownListCD";
import Loading from "../../components/Loading";
import { SeatType } from "../../components/Seat";
import SeatMapNormal from "../../components/SeatMapNormal";
import SeatMapSleeper from "../../components/SeatMapSleeper";
import { useCustomNavMutation } from "../../hooks/useCustomQuery";
import { addLocation, deleteLocation, getAllLocation } from "../../services/location.service";
import { addTrip, getFormData } from "../../services/trip.service";
import styles from "../../styles/addTrip.module.scss";
import { TypeBus } from "../../types/bus";
import { CoAndDriverType } from "../../types/trip";
import { generateNormalSeats, generateSleeperSeats } from "../../utils/useGenarateSeat";
import { toast } from "react-toastify";

type FormType = {
  tripName: string;
  carId: number;
  driverId: number;
  coDrivers: { id: number }[];
  departureId: number;
  arrivalId: number;
  price: number;
  startTime: string;
  endTime: string;
};

const AddTrip = () => {
  const [typeBus, setTypeBus] = useState<TypeBus | null>(null);
  const startTimeRef = useRef<HTMLInputElement | null>(null);
  const endTimeRef = useRef<HTMLInputElement | null>(null);

  const {
    data: formAddTripData,
    isLoading: isFormAddTripLoading,
    error: formAddTripError,
  } = useQuery({
    queryKey: ["formAddTrip"],
    queryFn: () => getFormData(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: locationsData,
    isLoading: isLocationsLoading,
    error: locationsError,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getAllLocation(),
    staleTime: 5 * 60 * 1000,
  });

  const [form, setForm] = useState<FormType>({
    tripName: "",
    carId: 0,
    driverId: 0,
    coDrivers: [],
    departureId: 0,
    arrivalId: 0,
    price: 0,
    startTime: "",
    endTime: "",
  });

  const [seats, setSeats] = useState<SeatType[]>([]);

  const addMutate = useCustomNavMutation(
    addTrip,
    "/trip-manage",
    "Thêm chuyến xe thành công",
    "Thêm chuyến xe thất bại"
  );

  const handleClickStartTime = () => {
    if (startTimeRef) {
      startTimeRef.current?.showPicker();
    } else {
      return;
    }
  };

  const handleClickEndTime = () => {
    if (startTimeRef) {
      endTimeRef.current?.showPicker();
    } else {
      return;
    }
  };

  const handleAddTrip = async () => {
    if(!form.carId || !form.departureId || !form.driverId || !form.endTime || !form.startTime || !form.price) {
      toast.error("Bạn nhập thiếu thông tin")
      return
    }

    const data = {
      form,
      seats,
    };

    addMutate.mutate(data);
  };

  const handleSelectedBus = (selectedBus: string) => {
    const detailBus = formAddTripData?.cars.filter((car) => car.licensePlate === selectedBus)[0];
    if (!detailBus) return;

    setForm((prev) => ({ ...prev, carId: detailBus.id }));

    setTypeBus(detailBus.type);

    if (detailBus.type === "xe thường") {
      setSeats(generateNormalSeats());
    } else {
      setSeats(generateSleeperSeats());
    }
  };
  const handleSelectedSeat = useCallback((seatsUpdate: SeatType[]) => {
    setSeats(seatsUpdate);
  }, []);

  const handleSelectedDeparture = (selectedDeparture: string) => {
    const getId = locationsData?.filter((lo) => lo.name === selectedDeparture)[0].id;
    setForm((prev) => ({ ...prev, departureId: getId ? getId : 0 }));
  };

  const handleSelectedArrival = (selectedArrival: string) => {
    const getId = locationsData?.filter((lo) => lo.name === selectedArrival)[0].id;
    setForm((prev) => ({ ...prev, arrivalId: getId ? getId : 0  }));
  };

  const handleChangeValueForm = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeFieldCoDriver = (fieldCoDrivers: CoAndDriverType[]) => {
    setForm((prev) => ({ ...prev, coDrivers: fieldCoDrivers.map((cd) => ({ id: cd.id })) }));
  };

  const handleSelectedDriver = (selectedDriver: string) => {
    const getPhone = selectedDriver.split("-")[1].trim();
    setForm((prev) => ({
      ...prev,
      driverId: formAddTripData?.drivers ? formAddTripData.drivers.filter((dr) => dr.phone === getPhone)[0].id : 0 ,
    }));
  };

  if (formAddTripError || locationsError) return <p>Lỗi khi tải dữ liệu</p>;
  if (isFormAddTripLoading || isLocationsLoading) return <Loading />;

  return (
    <div>
      <div className={styles["add-trip-wrapper"]}>
        <div className={styles["feats"]}>
          <Link to={`/trip-manage`} className={`${styles["btn-back"]} ${styles.btn}`}>
            Quay lại
          </Link>
          <button className={`${styles["btn-delete"]} ${styles.btn}`}>Xóa</button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTrip();
          }}
          className={styles.form}
        >
          <div className={styles.title}>
            <h2 className={styles["content-title"]}>Thêm chuyến xe</h2>
          </div>
          <ul className={styles["form-group-list"]}>
            <li className={styles["form-group-item"]}>
              <label htmlFor="trip-name" className={styles.title}>
                Tên Xe khách{" "}
              </label>
              <input
                id="trip-name"
                type="text"
                name="tripName"
                className={styles["form-control"]}
                placeholder="Nhập tên chuyến xe..."
                onChange={handleChangeValueForm}
              />
            </li>

            <li className={styles["form-group-item"]}>
              <label htmlFor="bus" className={styles.title}>
                Xe khách{" "}
              </label>
              <InputDropDownList
                idHTML="bus"
                list={formAddTripData?.cars.map((c) => c.licensePlate) || []}
                contentPlaceholder="Chọn xe khách..."
                onSelected={handleSelectedBus}
              />
            </li>
            {typeBus === null ? null : typeBus === "xe thường" ? (
              <li className={styles["form-group-item"]}>
                <label htmlFor="trip-name" className={styles.title}>
                  Loại xe{" "}
                </label>
                <p className={styles["form-control"]}>Xe thường</p>
              </li>
            ) : (
              <li className={styles["form-group-item"]}>
                <label htmlFor="trip-name" className={styles.title}>
                  Loại xe{" "}
                </label>
                <p className={styles["form-control"]}>Xe giường nằm</p>
              </li>
            )}

            <li className={styles["form-group-item"]}>
              <label htmlFor="bus" className={styles.title}>
                Tài xế
              </label>
              <InputDropDownList
                idHTML="driver"
                list={formAddTripData?.drivers.map((c) => `${c.fullName} - ${c.phone}`) || []}
                contentPlaceholder="Chọn tài xế..."
                onSelected={handleSelectedDriver}
              />
            </li>

            <li className={styles["form-group-item"]}>
              <label className={styles.title}>Phụ xe</label>
              <DynamicCoDriverSelect
                coDrivers={formAddTripData?.coDrivers}
                onFieldsChange={handleChangeFieldCoDriver}
              />
            </li>
            {typeBus === null ? null : typeBus === "xe thường" ? (
              <li className={styles["form-group-item"]}>
                <label className={styles.title}>Ghế</label>
                <SeatMapNormal initialSeats={seats} onSelected={handleSelectedSeat} />
              </li>
            ) : (
              <li className={styles["form-group-item"]}>
                <label className={styles.title}>Ghế</label>
                <SeatMapSleeper initialSeats={seats} onSelected={handleSelectedSeat} />
              </li>
            )}

            <li className={styles["form-group-item"]}>
              <label htmlFor="departure" className={styles.title}>
                Địa điểm khởi hành{" "}
              </label>
              <InputDropDownListCD
                idHTML="departure"
                titleModal="địa điểm"
                list={locationsData?.map((loc) => ({ id: loc.id, value: loc.name })) || []}
                contentPlaceholder="Nhập điểm đi"
                onSelected={handleSelectedDeparture}
                funcAddItem={addLocation}
                funcDelItem={deleteLocation}
              />
            </li>

            <li className={styles["form-group-item"]}>
              <label htmlFor="start-time" className={styles.title}>
                Thời gian khởi hành{" "}
              </label>
              <input
                ref={startTimeRef}
                id="start-time"
                type="datetime-local"
                name="startTime"
                className={styles["form-control"]}
                value={form.startTime}
                onChange={(e) => handleChangeValueForm(e)}
                onClick={handleClickStartTime}
              />
            </li>
            {/*  */}
            <li className={styles["form-group-item"]}>
              <label htmlFor="arrival" className={styles.title}>
                Địa điểm đón{" "}
              </label>
              <InputDropDownListCD
                idHTML="arrival"
                titleModal={"Địa điểm"}
                list={locationsData?.map((loc) => ({ id: loc.id, value: loc.name })) || []}
                contentPlaceholder="Nhập điểm đón"
                onSelected={handleSelectedArrival}
                funcAddItem={addLocation}
                funcDelItem={deleteLocation}
              />
            </li>

            <li className={styles["form-group-item"]}>
              <label htmlFor="end-time" className={styles.title}>
                Thời gian kết thúc{" "}
              </label>
              <input
                ref={endTimeRef}
                id="end-time"
                type="datetime-local"
                name="endTime"
                className={styles["form-control"]}
                value={form.endTime}
                onChange={(e) => handleChangeValueForm(e)}
                onClick={handleClickEndTime}
              />
            </li>

            <li className={styles["form-group-item"]}>
              <label htmlFor="price" className={styles.title}>
                Giá tiền cho mỗi ghế{" "}
              </label>
              <input
                id="price"
                type="number"
                name="price"
                className={styles["form-control"]}
                value={form.price}
                onChange={(e) => handleChangeValueForm(e)}
              />
            </li>

            <div className={styles.action}>
              <button type="submit" className={styles["btn-add"]}>
                Thêm mới
              </button>
            </div>
          </ul>
        </form>
      </div>
    </div>
  );
};

export default AddTrip;
