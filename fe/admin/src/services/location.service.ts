import { toast } from "react-toastify";
import { bookTicketAPI } from "./customize.service";
import { LocationType } from "../types/location";

export const addLocation = (newLocation: { newValue: string }) => {
  return bookTicketAPI.post(`/location/add`, newLocation).then((res) => {
    if (res.data.status === "OK") {
      toast.success("Thêm địa điểm mới thành công");
    } else {
      toast.success("Thêm địa điểm mới thất bại");
    }
    return res.data;
  });
};

export const deleteLocation = (id: number) => {
  return bookTicketAPI.delete(`/location/delete/${id}`).then((res) => {
    if (res.data.status === "OK") {
      toast.success("Xóa địa điểm thành công");
    } else {
      toast.success("Xóa địa điểm thất bại");
    }
    return res.data;
  });
};

export const getAllLocation = () => {
  return bookTicketAPI.get<LocationType[]>(`/location/get-all`).then((res) => res.data);
};
