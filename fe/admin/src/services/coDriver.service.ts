import { CoDriverData } from "../types/coDriver";
import { ArrangeType, ImageType } from "../types/type";
import { bookTicketAPI } from "./customize.service";

export const getCoDriverList = async ({
  offset,
  limit,
  arrangeType,
}: {
  offset: number;
  limit: number;
  arrangeType: ArrangeType;
}) => {
  return await bookTicketAPI
    .get<{ data: CoDriverData[]; total: number }>(
      `/co-driver/get-all?offset=${offset}&limit=${limit}&arrangeType=${arrangeType}`
    )
    .then((res) => res.data);
};

export const fetchCoDriver = async (id: string) => {
  return await bookTicketAPI
    .get<CoDriverData>(`/co-driver/get-detail/${id}`)
    .then((res) => res.data);
};

export const updateImgCoDriver = async (data: FormData) => {
  return await bookTicketAPI
    .put<ImageType>(`/co-driver/update-img`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const updateInfoCoDriver = async ({ id, data }: { id: number; data: object }) => {
  return await bookTicketAPI.put(`/co-driver/update-info/${id}`, data).then((res) => res.data);
};

export const addCoDriver = async (data: FormData) => {
  return await bookTicketAPI
    .post(`/co-driver/create`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};
