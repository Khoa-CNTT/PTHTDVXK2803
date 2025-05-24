import { BusType } from "../types/bus";
import { ArrangeType } from "../types/type";
import { bookTicketAPI } from "./customize.service";

export const getBusList = async ({
  offset,
  limit,
  arrangeType,
  licensePlateSearch,
  type,
}: {
  offset: number;
  limit: number;
  arrangeType: ArrangeType;
  licensePlateSearch: string;
  type: "xe-thuong" | "xe-giuong-nam" | "all";
}) => {
  return await bookTicketAPI
    .get<{ data: BusType[]; total: number; totalPage: number }>(
      `/bus/get-all?license_plate=${licensePlateSearch}&type=${type}&offset=${offset}&limit=${limit}&arrangeType=${arrangeType}`
    )
    .then((res) => res.data);
};

export const addBus = async (data: FormData) => {
  return await bookTicketAPI
    .post(`/bus/add`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

export const getDetailBus = async (licensePlate: string) => {
  return await bookTicketAPI
    .get<BusType>(`/bus/detail/${licensePlate}`, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data)
};

export const updateBus = async (data: FormData) => {
  return await bookTicketAPI.put(`/bus/update`, data).then((res) => res.data);
};

export const deleteBus = async (licensePlate: number) => {
  return await bookTicketAPI.delete(`/bus/delete/${licensePlate}`).then((res) => res.data);
};

export const addImgsBus = async (data: FormData) => {
  return await bookTicketAPI.post(`/bus/img-Bus/add`, data);
};
// success
export const updateImgBus = async (data: FormData): Promise<object> => {
  return await bookTicketAPI.put(`/bus/image/update`, data).then((res) => res.data);
};

export const deleteImgBus = async (data: object) => {
  return await bookTicketAPI.delete(`/bus/image/delete`, { data }).then((res) => res.data);
};
