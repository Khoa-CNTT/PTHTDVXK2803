import { CustomerType } from "../types/customer";
import { ArrangeType, ImageType } from "../types/type";
import { bookTicketAPI } from "./customize.service";

export const getCustomerList = async ({
  offset,
  limit,
  arrangeType,
  emailSearch,
}: {
  offset: number;
  limit: number;
  arrangeType: ArrangeType;
  emailSearch: string;
}) => {
  return await bookTicketAPI
    .get<{ data: CustomerType[]; total: number }>(
      `/customer/get-all?email=${emailSearch}&offset=${offset}&limit=${limit}&arrangeType=${arrangeType}`
    )
    .then((res) => res.data);
};

export const fetchCustomer = async (id: string) => {
  return await bookTicketAPI
    .get<CustomerType>(`/customer/get-detail/${id}`)
    .then((res) => res.data);
};



export const updateImgCustomer = async (data: FormData) => {
  return await bookTicketAPI
    .put<ImageType>(`/customer/update-img`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const updateInfoCustomer = async ({ id, data }: { id: number; data: object }) => {
  return await bookTicketAPI.put(`/customer/update-info/${id}`, data).then((res) => res.data);
};

export const addCustomer = async (data: FormData) => {
  return await bookTicketAPI
    .post(`/customer/create`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};


