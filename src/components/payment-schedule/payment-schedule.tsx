import type { FC } from "react";

import { useState } from "react";

import {
  Box,
  Chip,
  Paper,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from "@mui/material";
import { format, addMonths } from "date-fns";
import { uz } from "date-fns/locale";

import { Iconify } from "../iconify";
import { PaymentModal } from "../payment-modal";

interface PaymentScheduleItem {
  month: number;
  date: string;
  amount: number;
  isPaid: boolean;
  isInitial?: boolean;
}

interface PaymentScheduleProps {
  startDate: string;
  monthlyPayment: number;
  period: number;
  initialPayment?: number;
  initialPaymentDueDate?: string;
  contractId?: string;
  remainingDebt?: number;
  totalPaid?: number;
  payments?: Array<{
    date: Date;
    amount: number;
    isPaid: boolean;
  }>;
  onPaymentSuccess?: () => void;
}

const PaymentSchedule: FC<PaymentScheduleProps> = ({
  startDate,
  monthlyPayment,
  period,
  initialPayment = 0,
  initialPaymentDueDate,
  contractId,
  remainingDebt = 0,
  totalPaid = 0,
  payments = [],
  onPaymentSuccess,
}) => {
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    amount: number;
  }>({
    open: false,
    amount: 0,
  });
  // To'lov jadvalini yaratish
  const generateSchedule = (): PaymentScheduleItem[] => {
    const schedule: PaymentScheduleItem[] = [];
    const start = new Date(startDate);

    // Boshlang'ich to'lov qilinganmi tekshirish
    const isInitialPaid = totalPaid >= initialPayment;

    // Boshlang'ich to'lovni qo'shish
    if (initialPayment > 0) {
      const initialDate = initialPaymentDueDate
        ? new Date(initialPaymentDueDate)
        : start;

      schedule.push({
        month: 0,
        date: format(initialDate, "yyyy-MM-dd"),
        amount: initialPayment,
        isPaid: isInitialPaid,
        isInitial: true,
      });
    }

    // Oylik to'lovlarni qo'shish
    // To'langan oylarni hisoblash (totalPaid asosida)
    let remainingPaid = totalPaid - (isInitialPaid ? initialPayment : 0);

    for (let i = 1; i <= period; i++) {
      const paymentDate = addMonths(start, i);

      // Agar qolgan to'langan summa oylik to'lovdan katta yoki teng bo'lsa, bu oy to'langan
      const isPaid = remainingPaid >= monthlyPayment;
      if (isPaid) {
        remainingPaid -= monthlyPayment;
      }

      schedule.push({
        month: i,
        date: format(paymentDate, "yyyy-MM-dd"),
        amount: monthlyPayment,
        isPaid,
      });
    }

    return schedule;
  };

  const schedule = generateSchedule();
  const today = new Date();

  const handlePayment = (amount: number) => {
    setPaymentModal({ open: true, amount });
  };

  const handlePayAll = () => {
    setPaymentModal({ open: true, amount: remainingDebt });
  };

  const handlePaymentSuccess = () => {
    setPaymentModal({ open: false, amount: 0 });
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">To'lov jadvali</Typography>
          {remainingDebt > 0 && contractId && (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<Iconify icon="mdi:cash-multiple" />}
              onClick={handlePayAll}
            >
              Barchasini to'lash ({remainingDebt.toLocaleString()} $)
            </Button>
          )}
        </Box>

        <TableContainer sx={{ maxHeight: 400 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Sana</TableCell>
                <TableCell align="right">Summa</TableCell>
                <TableCell align="center">Holat</TableCell>
                {contractId && <TableCell align="center">Amal</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {schedule.map((item) => {
                const isPast = new Date(item.date) < today;
                const isCurrent =
                  new Date(item.date).getMonth() === today.getMonth() &&
                  new Date(item.date).getFullYear() === today.getFullYear();

                return (
                  <TableRow
                    key={item.month}
                    sx={{
                      bgcolor: item.isPaid ? "success.lighter" : "inherit",
                    }}
                  >
                    <TableCell>
                      <Box>
                        {item.isInitial && (
                          <Chip
                            label="Oldindan to'lov"
                            size="small"
                            color="info"
                            sx={{ mr: 1, mb: 0.5 }}
                          />
                        )}
                        <Typography variant="body2">
                          {format(new Date(item.date), "dd MMMM yyyy", {
                            locale: uz,
                          })}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        {item.amount.toLocaleString()} $
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {item.isPaid ? (
                        <Chip
                          label="To'langan"
                          color="success"
                          size="small"
                          icon={<Iconify icon="mdi:check-circle" />}
                        />
                      ) : (
                        <Chip
                          label="Kutilmoqda"
                          size="small"
                          sx={{
                            bgcolor: "grey.200",
                            color: "text.secondary",
                          }}
                        />
                      )}
                    </TableCell>
                    {contractId && (
                      <TableCell align="center">
                        {!item.isPaid && (
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => handlePayment(item.amount)}
                          >
                            To'lash
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            Jami: {period} oy
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            Umumiy: {(monthlyPayment * period).toLocaleString()} $
          </Typography>
        </Box>
      </Paper>

      {/* To'lov modal */}
      {contractId && (
        <PaymentModal
          open={paymentModal.open}
          amount={paymentModal.amount}
          contractId={contractId}
          onClose={() => setPaymentModal({ open: false, amount: 0 })}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default PaymentSchedule;
