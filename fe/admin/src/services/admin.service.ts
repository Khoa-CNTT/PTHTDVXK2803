import { AdminType } from "../types/admin";
import { ArrangeType } from "../types/type";
import { bookTicketAPI } from "./customize.service";

export const getAdminList = async ({
  offset,
  limit,
  arrangeType,
}: {
  offset: number;
  limit: number;
  arrangeType: ArrangeType;
}) => {
  return await bookTicketAPI
    .get<{ data: AdminType[]; total: number }>(
      `/admin/get-all?offset=${offset}&limit=${limit}&arrangeType=${arrangeType}`
    )
    .then((res) => res.data);
};

export const fetchAdmin = async (id: string) => {
  return await bookTicketAPI.get<AdminType>(`/admin/get-detail/${id}`).then((res) => res.data);
};

export const updateInfoAdmin = async ({ id, data }: { id: number; data: object }) => {
  return await bookTicketAPI.put(`/admin/update/${id}`, data).then((res) => res.data);
};

export const addAdmin = async (data: { email: string; fullName: string; password: string }) => {
  return await bookTicketAPI.post(`/admin/create`, data).then((res) => res.data);
};
