import { ArrangeType } from "../types/type";
import { PromotionType } from "../types/promotion";
import { bookTicketAPI } from "./customize.service";

export const getPromotionList = async ({
  offset,
  limit,
  arrangeType,
  codeSearch,
  carTypes,
  type,
}: {
  offset: number;
  limit: number;
  arrangeType: ArrangeType;
  codeSearch: string;
  carTypes: string[];
  type: string;
}) => {
  return await bookTicketAPI
    .get<{ data: PromotionType[]; total: number }>(
      `/promotion/get-all?code=${codeSearch}&carTypes=${carTypes}&type=${type}&offset=${offset}&limit=${limit}&arrangeType=${arrangeType}`
    )
    .then((res) => res.data);
};

export const fetchPromotionByCode = async (code: string) => {
  return await bookTicketAPI
    .get<PromotionType>(`/promotion/get-detail-by-code/${code}`)
    .then((res) => res.data);
};

export const fetchPromotionById = async (id: string) => {
  return await bookTicketAPI
    .get<PromotionType>(`/promotion/get-detail-by-id/${id}`)
    .then((res) => res.data);
};

export const updateInfoPromotion = async ({ id, data }: { id: number; data: object }) => {
  return await bookTicketAPI.put(`/promotion/update/${id}`, data).then((res) => res.data);
};

export const addPromotion = async (data: object) => {
  return await bookTicketAPI.post(`/promotion/create`, data).then((res) => res.data);
};
