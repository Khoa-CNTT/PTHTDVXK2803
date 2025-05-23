import { toast } from "react-toastify";
import { LocationType, SearchTripResponse, TripBookedInfo } from "../types/trip";
import { bookTicketAPI } from "./customizeAxios.service";

export const detailTripBooked = async ({
  from,
  to,
  start_day,
  start_hours,
  end_day,
  end_hours,
  license_plate,
}: {
  from: number;
  to: number;
  start_day: string;
  start_hours: string;
  end_day: string;
  end_hours: string;
  license_plate: string;
}) => {
  try {
    const response = await bookTicketAPI.get<TripBookedInfo>(
      `/trip/detail-booked?from=${from}&to=${to}&start_day=${start_day}&start_hours=${start_hours}&end_day=${end_day}&end_hours=${end_hours}&license_plate=${license_plate}`
    );
    return response.data;
  } catch (err) {
    toast.warning(err instanceof Error ? err.message : "Lỗi không tìm thấy Chuyến xe này");
    return null;
  }
};

export const searchTrip = async (data: object) => {
  try {
    const response = await bookTicketAPI.post("/trip/search", data);
    return response.data;
  } catch (err) {
    toast.warning(err instanceof Error ? err.message : "Lỗi khi tìm kiếm chuyến xe");
    return null;
  }
};

export const getLocations = async () => {
  try {
    const response = await bookTicketAPI.get<LocationType[]>("/location/get-all");
    return response.data;
  } catch (err) {
    toast.warning(err instanceof Error ? err.message : "Lỗi khi tải danh sách địa điểm");
    return null;
  }
};

export const searchTrips = async ({
  from,
  to,
  start_time,
  sort,
  limit,
  offset,
}: {
  from: number;
  to: number;
  start_time: string;
  sort: string;
  limit: number;
  offset: number;
}) => {
  try {
    const response = await bookTicketAPI.get<SearchTripResponse>(
      `/trip/search?from=${from}&to=${to}&start_time=${start_time}&sort=${sort}&limit=${limit}&offset=${offset}`
    );
    return response.data;
  } catch (err) {
    toast.warning(err instanceof Error ? err.message : "Lỗi khi tìm kiếm danh sách chuyến");
    return null;
  }
};
