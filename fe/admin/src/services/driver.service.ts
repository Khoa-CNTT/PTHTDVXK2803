import { DriverType } from "../types/driver";
import { ArrangeType, ImageType } from "../types/type";
import { bookTicketAPI } from "./customize.service";

export const getDriverList = async ({
  offset,
  limit,
  arrangeType,
}: {
  offset: number;
  limit: number;
  arrangeType: ArrangeType;
}) => {
  return await bookTicketAPI
    .get<{ data: DriverType[]; total: number }>(
      `/driver/get-all?offset=${offset}&limit=${limit}&arrangeType=${arrangeType}`
    )
    .then((res) => res.data);
};

export const fetchDriver = async (id: string) => {
  return await bookTicketAPI.get<DriverType>(`/driver/get-detail/${id}`).then((res) => res.data);
};

export const updateImgDriver = async (data: FormData) => {
  return await bookTicketAPI
    .put<ImageType>(`/driver/update-img`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const updateInfoDriver = async ({ id, data }: { id: number; data: object }) => {
  return await bookTicketAPI.put(`/driver/update-info/${id}`, data).then((res) => res.data);
};

export const addDriver = async (data: FormData) => {
  return await bookTicketAPI
    .post(`/driver/create`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const deleteDriver = async (id: number) => {
  return await bookTicketAPI.delete(`/driver/delete/${id}`).then((res) => res.data);
};
