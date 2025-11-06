import authApi from "src/server/auth";

import { start, success, failure, setCashs } from "../slices/cashSlice";

import type { AppThunk } from "../index";

export const getCashs = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const res = await authApi.get("/cash/get-all");
    const { data } = res;
    console.log("📊 Cash data received:", data);
    console.log("📊 Total items:", data?.length || 0);
    dispatch(setCashs(data));
  } catch (error: any) {
    console.error("❌ Error fetching cash:", error);
    dispatch(failure());
  }
};

export const confirmationCash =
  (cashIds: string[]): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      await authApi.put("/cash/confirmation", { cashIds });
      dispatch(success());
      dispatch(getCashs());
    } catch (err) {
      dispatch(failure());
    }
  };

export const updateCash =
  (data: any): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      await authApi.put("/payment", data);
      dispatch(success());
      dispatch(getCashs());
    } catch (err) {
      dispatch(failure());
    }
  };
