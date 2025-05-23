import { bookTicketAPI } from "./customizeAxios.service";

export const fetchUser = async (token: string) => {
  try {
    const response = await bookTicketAPI.post(
      `/user/get-detail/${token}`,
      {}, // Truyền body là {} để không gửi dữ liệu không mong muốn
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error?.message : "Lỗi khi lấy thông tin người dùng");
  }
};

export const addCustomer = async (data: FormData) => {
  try {
    const response = await bookTicketAPI.post(
      `/customer/add`,
      data
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error?.message : "Lỗi khi thêm khách hàng");
  }
};

export const updateCustomer = async (id: number, data: FormData) => {
  try {
    const response = await bookTicketAPI.put(
      `/customer/update/${id}`,
      data
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error?.message : "Lỗi khi cập nhật khách hàng");
  }
};
