import authApi from "src/server/auth";
import { enqueueSnackbar } from "../slices/snackbar";
import type { AppThunk } from "../index";

// Payment history action
export const getPaymentHistory =
  (customerId?: string, contractId?: string): AppThunk =>
  async (dispatch) => {
    try {
      console.log("Fetching payment history...", { customerId, contractId });

      let url = "/payment/history";
      const params = new URLSearchParams();

      if (customerId) params.append("customerId", customerId);
      if (contractId) params.append("contractId", contractId);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await authApi.get(url);
      console.log("Payment history response:", res.data);

      return res.data;
    } catch (error: any) {
      console.error("Payment history error:", error);
      dispatch(
        enqueueSnackbar({
          message:
            error.response?.data?.message ||
            "To'lovlar tarixini olishda xatolik",
          options: { variant: "error" },
        })
      );
      throw error;
    }
  };

// Pay debt action
export const payDebt =
  (paymentData: any): AppThunk =>
  async (dispatch) => {
    try {
      console.log("Processing payment...", paymentData);

      const res = await authApi.put("/payment", paymentData);
      console.log("Payment response:", res.data);

      dispatch(
        enqueueSnackbar({
          message: res.data.message || "To'lov muvaffaqiyatli amalga oshirildi",
          options: { variant: "success" },
        })
      );

      return res.data;
    } catch (error: any) {
      console.error("Payment error:", error);
      dispatch(
        enqueueSnackbar({
          message:
            error.response?.data?.message || "To'lov amalga oshirishda xatolik",
          options: { variant: "error" },
        })
      );
      throw error;
    }
  };
