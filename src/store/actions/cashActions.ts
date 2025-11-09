import authApi from "src/server/auth";
import logger from "src/utils/logger";

import { start, success, setPayments, setError } from "../slices/cashSlice";
import { enqueueSnackbar } from "../slices/snackbar";

import type { AppThunk } from "../index";

// New action: getPendingPayments
export const getPendingPayments = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    logger.log("🔍 Fetching pending payments...");
    const res = await authApi.get("/cash/pending");

    // Backend returns { success: true, message: "...", data: [], count: 0 }
    const responseData = res.data?.data || res.data;
    const payments = Array.isArray(responseData) ? responseData : [];

    logger.log("📊 Pending payments received:", payments.length);

    if (payments.length > 0) {
      logger.log("✅ Sample payment:", payments[0]);
      logger.log("✅ Sample payment contractId:", payments[0].contractId);
      logger.log("✅ Has contractId?", !!payments[0].contractId);
    } else {
      logger.log("⚠️ No pending payments found");
    }

    dispatch(setPayments(payments));
    logger.log("✅ Payments loaded successfully");
  } catch (error: any) {
    logger.error("❌ Error fetching pending payments:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Xatolik yuz berdi";
    logger.error("Error details:", error.response?.data || error.message);

    dispatch(setError(errorMessage));
    dispatch(
      enqueueSnackbar({
        message: `To'lovlarni yuklashda xatolik: ${errorMessage}`,
        options: { variant: "error" },
      })
    );
  }
};

// New action: confirmPayments
export const confirmPayments =
  (paymentIds: string[]): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      logger.log("✅ Confirming payments:", paymentIds);
      const res = await authApi.post("/cash/confirm-payments", { paymentIds });

      logger.log("📊 Confirmation result:", res.data);

      dispatch(success());
      dispatch(
        enqueueSnackbar({
          message: "To'lovlar muvaffaqiyatli tasdiqlandi",
          options: { variant: "success" },
        })
      );

      // Refresh pending payments list
      logger.log("🔄 Refreshing pending payments...");
      dispatch(getPendingPayments());
    } catch (error: any) {
      logger.error("❌ Error confirming payments:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Xatolik yuz berdi";

      dispatch(setError(errorMessage));
      dispatch(
        enqueueSnackbar({
          message: `To'lovlarni tasdiqlashda xatolik: ${errorMessage}`,
          options: { variant: "error" },
        })
      );
    }
  };

// New action: rejectPayment
export const rejectPayment =
  (paymentId: string, reason: string): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      logger.log("❌ Rejecting payment:", paymentId, "Reason:", reason);
      const res = await authApi.post("/cash/reject-payment", {
        paymentId,
        reason,
      });

      logger.log("📊 Rejection result:", res.data);

      dispatch(success());
      dispatch(
        enqueueSnackbar({
          message: "To'lov muvaffaqiyatli rad etildi",
          options: { variant: "success" },
        })
      );

      // Refresh pending payments list
      logger.log("🔄 Refreshing pending payments...");
      dispatch(getPendingPayments());
    } catch (error: any) {
      logger.error("❌ Error rejecting payment:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Xatolik yuz berdi";

      dispatch(setError(errorMessage));
      dispatch(
        enqueueSnackbar({
          message: `To'lovni rad etishda xatolik: ${errorMessage}`,
          options: { variant: "error" },
        })
      );
    }
  };
