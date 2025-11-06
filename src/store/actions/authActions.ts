import type { ILoginFormValues } from "src/types/login";

// import authApi from "src/server/auth";
import axiosInstance from "src/server/api";

import { enqueueSnackbar } from "../slices/snackbar";
import {
  loginStart,
  logoutUser,
  refreshStart,
  loginSuccess,
  loginFailure,
  refreshFailure,
  refreshSuccess,
} from "../slices/authSlice";

import type { AppThunk } from "../index";

export const refreshProfile = (): AppThunk => async (dispatch) => {
  dispatch(refreshStart());

  try {
    const response = await axiosInstance.get("/auth/refresh");
    dispatch(refreshSuccess(response.data));
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;

    // 401 xatolik bo'lsa, tokenni o'chirish va login sahifasiga yo'naltirish
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      dispatch(logoutUser());
    }

    dispatch(refreshFailure(errorMessage));
  }
};

export const login =
  (data: ILoginFormValues): AppThunk =>
  async (dispatch) => {
    dispatch(loginStart());
    try {
      const response = await axiosInstance.post("/auth/login", data);
      dispatch(loginSuccess(response.data));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      dispatch(
        enqueueSnackbar({
          message: errorMessage,
          options: { variant: "error" },
        })
      );
      dispatch(loginFailure(errorMessage));
    }
  };

// export const refreshUser = (): AppThunk => async (dispatch) => {
//   try {
//     const response = await axiosInstance.get("/auth/refresh");
//     dispatch(signUserSuccess(response.data));
//   } catch (error: any) {
//     const errorMessage = error.response?.data?.message || error.message;

//     dispatch(refreshUserFailure(errorMessage));
//   }
// };

export const logout = (): AppThunk => async (dispatch) => {
  try {
    await axiosInstance.get("/auth/logout");
    dispatch(logoutUser());
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;

    dispatch(loginFailure(errorMessage));
  }
};
