import { LocationType, SearchTripResponse } from "../types/trip";
import { bookTicketAPI } from "./customizeAxios.service";

export const searchTrip = async (data: object) => {
  const response = await bookTicketAPI.post("/trip/search", data).then((res) => res.data);
  return response;
};

export const getLocations = async () => {
  const response = await bookTicketAPI
    .get<LocationType[]>("/location/get-all")
    .then((res) => res.data);
  return response;
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
  const response = await bookTicketAPI
    .get<SearchTripResponse>(
      `/trip/search?from=${from}&to=${to}&start_time=${start_time}
      &sort=${sort}&limit=${limit}&offset=${offset}`
    )
    .then((res) => res.data);
  return response;
};
