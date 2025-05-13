import { Dispatch } from "redux";
import { fetchUser } from "../../services/userServices.service";
import { AxiosError } from "axios";
import { User } from "../../types";

export const fetchUserData = (token: string) => async (dispatch: Dispatch) => {
  dispatch({ type: "USER_LOADING" });
  try {
    const userDetail = await fetchUser(token);

    dispatch({ type: "USER_SUCCESS", payload: userDetail });
  } catch (error: unknown) {
    let errMessage = "Lỗi không xác định";

    if (error instanceof AxiosError) {
      errMessage = error.response?.data?.message || "Lỗi API";
    } else if (error instanceof Error) {
      errMessage = error?.message;
    }
    dispatch({ type: "USER_ERROR", error: errMessage });
  }
};

export const setUser = (user: User) => (dispatch: Dispatch) => {
  dispatch({ type: "SET_USER", payload: user });
};

export const clearUser = () => (dispatch: Dispatch) => {
  dispatch({ type: "CLEAR_USER" });
};
