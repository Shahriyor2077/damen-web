import type { IContract } from "src/types/contract";

import React from "react";
import { IoChevronDownOutline } from "react-icons/io5";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { getCustomer } from "src/store/actions/customerActions";

import Grid from "@mui/material/Unstable_Grid2";
import {
  Box,
  Chip,
  Paper,
  Stack,
  Divider,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import { PaymentSchedule } from "src/components/payment-schedule";

interface IProps {
  customerContracts?: IContract[];
  customerId?: string;
}

const CustomerContract: React.FC<IProps> = ({
  customerContracts,
  customerId,
}) => {
  const dispatch = useAppDispatch();
  console.log("dfdgf", customerContracts);

  const sortedContracts = [...(customerContracts ?? [])].sort((a, b) => {
    const order = { active: 0, cancelled: 1, completed: 2 };
    return order[a.status] - order[b.status];
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Faol";
      case "completed":
        return "Yakunlangan";
      case "cancelled":
        return "Bekor qilingan";
      default:
        return status;
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight="bold">
        Xarid qilingan mahsulotlar
      </Typography>

      {sortedContracts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            Hozircha xarid qilingan mahsulot yo'q
          </Typography>
        </Paper>
      ) : (
        sortedContracts.map((contract) => (
          <Paper
            elevation={3}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
            }}
            key={contract._id}
          >
            <Accordion sx={{ boxShadow: "none" }}>
              <AccordionSummary
                expandIcon={<IoChevronDownOutline size={24} />}
                sx={{
                  bgcolor: "background.neutral",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  width="100%"
                  flexWrap="wrap"
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
                    {contract.productName}
                  </Typography>

                  <Chip
                    label={getStatusLabel(contract.status)}
                    color={getStatusColor(contract.status)}
                    size="small"
                  />

                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Boshlangan sana
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {new Date(contract.startDate).toLocaleDateString(
                          "uz-UZ"
                        )}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Muddat
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {contract.period} oy
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Oylik to'lov
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {contract.monthlyPayment.toLocaleString()} $
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {/* Shartnoma ma'lumotlari */}
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                      Shartnoma ma'lumotlari
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary">
                          Mahsulot nomi
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {contract.productName}
                        </Typography>
                      </Grid>
                      <Grid xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary">
                          Asl narxi
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {contract.originalPrice.toLocaleString()} $
                        </Typography>
                      </Grid>
                      <Grid xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary">
                          Sotish narxi
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {contract.price.toLocaleString()} $
                        </Typography>
                      </Grid>
                      <Grid xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary">
                          Boshlang'ich to'lov
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {contract.initialPayment.toLocaleString()} $
                        </Typography>
                      </Grid>
                      <Grid xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary">
                          Foiz
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {contract.percentage}%
                        </Typography>
                      </Grid>
                      <Grid xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary">
                          Umumiy narx
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {contract.totalPrice.toLocaleString()} $
                        </Typography>
                      </Grid>
                      <Grid xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary">
                          To'langan
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color="success.main"
                        >
                          {contract.totalPaid?.toLocaleString() || 0} $
                        </Typography>
                      </Grid>
                      <Grid xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary">
                          Qolgan qarz
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color="error.main"
                        >
                          {contract.remainingDebt?.toLocaleString() || 0} $
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Divider />

                  {/* To'lov jadvali */}
                  <PaymentSchedule
                    startDate={contract.startDate}
                    monthlyPayment={contract.monthlyPayment}
                    period={contract.period}
                    initialPayment={contract.initialPayment}
                    initialPaymentDueDate={contract.initialPaymentDueDate}
                    contractId={contract._id}
                    remainingDebt={contract.remainingDebt}
                    totalPaid={contract.totalPaid}
                    payments={contract.payments}
                    onPaymentSuccess={() => {
                      // Mijozni qayta yuklash
                      if (customerId) {
                        dispatch(getCustomer(customerId));
                      }
                    }}
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Paper>
        ))
      )}
    </Stack>
  );
};

export default CustomerContract;
