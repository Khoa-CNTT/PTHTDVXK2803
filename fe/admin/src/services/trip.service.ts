import { FormDataType, TripData, TripInfo } from "../types/trip";
import { ArrangeType } from "../types/type";
import { bookTicketAPI } from "./customize.service";

export const getFormData = () => {
  return bookTicketAPI.get<FormDataType>("/trip/form-data").then((res) => res.data);
};

export const addTrip = async (data: object) => {
  return bookTicketAPI.post("/trip/add", data).then((res) => res.data);
};

export const getAllTrip = async ({
  offset,
  limit,
  arrangeType,
  licensePlateSearch,
}: {
  offset: number;
  limit: number;
  arrangeType: ArrangeType;
  licensePlateSearch: string;
}) => {
  return await bookTicketAPI
    .get<{ data: TripData[]; total: number }>(
      `/trip/get-all?license_plate=${licensePlateSearch}&offset=${offset}&limit=${limit}&arrangeType=${arrangeType}`
    )
    .then((res) => res.data);
};

export const fetchTrip = async (id: string) => {
  return await bookTicketAPI.get<TripInfo>(`/trip/get-detail/${id}`).then((res) => res.data);
};
