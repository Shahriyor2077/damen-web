import type { RootState } from "src/store";
import type { IPayment } from "src/types/cash";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { MdCancel, MdCheckCircle } from "react-icons/md";

import {
  Box,
  Chip,
  List,
  Stack,
  Button,
  Dialog,
  Avatar,
  Tooltip,
  Divider,
  ListItem,
  Typography,
  DialogTitle,
  ListItemText,
  DialogActions,
  DialogContent,
  CircularProgress,
} from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import authApi from "src/server/auth";
import { closeModal } from "src/store/slices/modalSlice";
import { setCustomerId } from "src/store/slices/customerSlice";

const ModalCashInfo = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { cashInfoModal } = useSelector((state: RootState) => state.modal);
  const { profile } = useSelector((state: RootState) => state.auth);

  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Get payment data from modal
  const payment = cashInfoModal?.data?.data as any;

  // Extract contractId from payment
  const contractId = payment?.contractId;

  const handleClose = useCallback(() => {
    dispatch(closeModal("cashInfoModal"));
    setContract(null); // Reset contract data on close
  }, [dispatch]);

  useEffect(() => {
    // Debug: payment obyektini ko'rish
    // console.log("🔍 === MODAL OPENED ===");
    // console.log("🔍 cashInfoModal:", cashInfoModal);
    // console.log("🔍 Payment data:", payment);
    // console.log("🔍 Contract ID:", contractId);

    // Fetch contract data
    if (!contractId) {
      // console.log("⚠️ No contract ID found in payment");
      // console.log(
      //   "⚠️ Payment keys:",
      //   payment ? Object.keys(payment) : "payment is null"
      // );
      // console.log("⚠️ Payment._id:", payment?._id);
      // console.log("⚠️ Payment.contractId:", payment?.contractId);
      return;
    }

    const fetchContract = async () => {
      try {
        setLoading(true);
        // console.log("🔍 Fetching contract data for ID:", contractId);
        const res = await authApi.get(
          `/contract/get-contract-by-id/${contractId}`
        );
        // console.log("✅ Contract API response:", res);
        setContract(res.data);
        // console.log("✅ Contract data loaded:", res.data);
      } catch (error: any) {
        console.error("❌ Error fetching contract:", error);
        // console.error("❌ Error response:", error.response?.data);
        // console.error("❌ Error status:", error.response?.status);
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [contractId]);

  return (
    <Dialog
      open={!!cashInfoModal?.type}
      maxWidth="md"
      fullWidth
      onClose={handleClose}
    >
      <DialogTitle>Shartnoma Ma'lumotlari</DialogTitle>
      <DialogContent>
        {loading ? (
          <Stack alignItems="center" justifyContent="center" p={4}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Shartnoma ma'lumotlari yuklanmoqda...
            </Typography>
          </Stack>
        ) : !contract ? (
          <Stack alignItems="center" justifyContent="center" p={4}>
            <Typography variant="body1" color="text.secondary">
              Shartnoma ma'lumotlari topilmadi
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Mijoz ma'lumotlari */}
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Mijoz
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 40, height: 40 }} />
                <Typography variant="body1">
                  {contract?.customer?.firstName} {contract?.customer?.lastName}
                </Typography>
              </Stack>
            </Stack>

            <Divider />

            {/* Shartnoma ma'lumotlari */}
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Mahsulot nomi"
                  secondary={contract?.productName || "___"}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Umumiy narx"
                  secondary={`${contract?.totalPrice?.toLocaleString() || "0"} $`}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Boshlang'ich to'lov"
                  secondary={`${contract?.initialPayment?.toLocaleString() || "0"} $`}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Oylik to'lov"
                  secondary={`${contract?.monthlyPayment?.toLocaleString() || "0"} $`}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Muddat"
                  secondary={`${contract?.duration || "0"} oy`}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Boshlanish sanasi"
                  secondary={
                    contract?.startDate
                      ? new Date(contract.startDate).toLocaleDateString("uz-UZ")
                      : "___"
                  }
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Tugash sanasi"
                  secondary={
                    contract?.endDate
                      ? new Date(contract.endDate).toLocaleDateString("uz-UZ")
                      : "___"
                  }
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText
                  primary="Holat"
                  secondary={
                    <Chip
                      label={contract?.status || "___"}
                      color={
                        contract?.status === "ACTIVE" ? "success" : "default"
                      }
                      size="small"
                    />
                  }
                />
              </ListItem>
            </List>

            <Button
              variant="contained"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                if (contractId) {
                  const role = profile.role || "admin";
                  navigate(`/${role}/contract/${contractId}`);
                  handleClose();
                }
              }}
            >
              Shartnomani ko'rish
            </Button>
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Yopish
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCashInfo;
