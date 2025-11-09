import type { FC } from "react";

import React, { useState } from "react";

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
    paymentType?: string;
    status?: string;
    remainingAmount?: number;
    excessAmount?: number;
    expectedAmount?: number;
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
      // 0.01 qo'shamiz - kichik hisob-kitob xatoliklarini hisobga olish uchun
      const isPaid = remainingPaid >= monthlyPayment - 0.01;

      if (isPaid) {
        // Har bir to'langan oydan oylik to'lovni ayiramiz
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
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h6">To'lov jadvali</Typography>
            <Typography variant="caption" color="text.secondary">
              {period} oylik to'lov rejasi
            </Typography>
          </Box>
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

        {/* Legend - Izoh */}
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            bgcolor: "grey.50",
            borderRadius: 1,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Typography
            variant="caption"
            fontWeight="medium"
            color="text.secondary"
          >
            Izoh:
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: "success.lighter",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">To'langan</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: "warning.lighter",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Kam to'langan</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: "error.lighter",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Kechikkan</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: "grey.200",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Kutilmoqda</Typography>
          </Box>
        </Box>

        <TableContainer sx={{ maxHeight: 600, overflowX: "auto" }}>
          <Table size="small" stickyHeader sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.100" }}>
                  #
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.100" }}>
                  Belgilangan sana
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.100" }}>
                  To'langan sana
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", bgcolor: "grey.100" }}
                >
                  Summa
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", bgcolor: "grey.100" }}
                >
                  Holat
                </TableCell>
                {contractId && (
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", bgcolor: "grey.100" }}
                  >
                    Amal
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                let previousExcess = 0; // Oldingi oydan kelgan ortiqcha summa

                return schedule.map((item, index) => {
                  const isPast = new Date(item.date) < today;

                  // Haqiqiy to'lov ma'lumotlarini topish
                  const actualPayment = payments.find((p) => {
                    const paymentDate = new Date(p.date);
                    const itemDate = new Date(item.date);
                    return (
                      paymentDate.getMonth() === itemDate.getMonth() &&
                      paymentDate.getFullYear() === itemDate.getFullYear() &&
                      p.isPaid
                    );
                  });

                  const hasExcess =
                    actualPayment?.excessAmount != null &&
                    actualPayment.excessAmount > 0.01;
                  const hasShortage =
                    actualPayment?.remainingAmount != null &&
                    actualPayment.remainingAmount > 0.01;

                  // Haqiqiy to'langan summa
                  const actualPaidAmount = actualPayment?.amount || 0;
                  const expectedAmount =
                    actualPayment?.expectedAmount || item.amount;

                  // Kechikish kunlarini hisoblash
                  let delayDays = 0;
                  if (actualPayment && item.isPaid) {
                    const scheduledDate = new Date(item.date);
                    const paidDate = new Date(actualPayment.date);
                    delayDays = Math.floor(
                      (paidDate.getTime() - scheduledDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                  }

                  // KASKAD LOGIKA - Serverdan kelgan ma'lumotlarni ishlatish
                  const fromPreviousMonth = previousExcess; // Oldingi oydan kelgan
                  const monthlyPaymentAmount = item.amount; // Oylik to'lov

                  // Agar actualPayment mavjud bo'lsa, serverdan kelgan expectedAmount ni ishlatamiz
                  const needToPay = actualPayment?.expectedAmount
                    ? actualPayment.expectedAmount
                    : Math.max(0, monthlyPaymentAmount - fromPreviousMonth); // To'lash kerak

                  const actuallyPaid = actualPaidAmount; // To'langan

                  // Ortiqcha/Kam summani hisoblash
                  let toNextMonth = 0;
                  let shortage = 0;

                  if (item.isPaid && actualPayment) {
                    // Serverdan kelgan ma'lumotlarni ishlatish
                    if (
                      actualPayment.excessAmount &&
                      actualPayment.excessAmount > 0.01
                    ) {
                      toNextMonth = actualPayment.excessAmount;
                    } else if (
                      actualPayment.remainingAmount &&
                      actualPayment.remainingAmount > 0.01
                    ) {
                      shortage = actualPayment.remainingAmount;
                    } else {
                      // Agar server ma'lumoti bo'lmasa, o'zimiz hisoblash
                      const diff = actuallyPaid - needToPay;
                      if (diff > 0.01) {
                        toNextMonth = diff;
                      } else if (diff < -0.01) {
                        shortage = Math.abs(diff);
                      }
                    }
                  }

                  // Keyingi oy uchun previousExcess ni yangilash
                  if (item.isPaid) {
                    previousExcess = toNextMonth;
                  } else {
                    previousExcess = 0; // Agar to'lanmagan bo'lsa, kaskad to'xtaydi
                  }

                  return (
                    <React.Fragment key={`payment-${item.month}`}>
                      <TableRow
                        sx={{
                          bgcolor: item.isPaid
                            ? hasShortage
                              ? "warning.lighter"
                              : "success.lighter"
                            : isPast && !item.isPaid
                              ? "error.lighter"
                              : "inherit",
                          "&:hover": {
                            bgcolor: item.isPaid
                              ? hasShortage
                                ? "warning.light"
                                : "success.light"
                              : "action.hover",
                          },
                        }}
                      >
                        {/* # */}
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" fontWeight="medium">
                              {item.isInitial ? "0" : item.month}
                            </Typography>
                            {item.isInitial && (
                              <Chip
                                label="Boshlang'ich"
                                size="small"
                                color="info"
                                sx={{
                                  fontWeight: "medium",
                                  fontSize: "0.7rem",
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>

                        {/* Belgilangan sana */}
                        <TableCell>
                          <Typography variant="body2">
                            {format(new Date(item.date), "dd MMM yyyy", {
                              locale: uz,
                            })}
                          </Typography>
                        </TableCell>

                        {/* To'langan sana */}
                        <TableCell>
                          {item.isPaid ? (
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight="medium"
                                color={
                                  delayDays > 0 ? "error.main" : "success.main"
                                }
                              >
                                {item.isInitial
                                  ? // Boshlang'ich to'lov - belgilangan sana
                                    format(new Date(item.date), "dd MMM yyyy", {
                                      locale: uz,
                                    })
                                  : // Oylik to'lov - haqiqiy to'lov sanasi
                                    actualPayment
                                    ? format(
                                        new Date(actualPayment.date),
                                        "dd MMM yyyy",
                                        {
                                          locale: uz,
                                        }
                                      )
                                    : format(
                                        new Date(item.date),
                                        "dd MMM yyyy",
                                        {
                                          locale: uz,
                                        }
                                      )}
                              </Typography>
                              {!item.isInitial && delayDays > 0 && (
                                <Typography
                                  variant="caption"
                                  color="error.main"
                                >
                                  ({delayDays} kun kechikkan)
                                </Typography>
                              )}
                              {!item.isInitial && delayDays < 0 && (
                                <Typography
                                  variant="caption"
                                  color="success.main"
                                >
                                  ({Math.abs(delayDays)} kun oldin)
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>

                        {/* Summa */}
                        <TableCell align="right">
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {expectedAmount.toLocaleString()} $
                            </Typography>
                            {item.isPaid &&
                              hasShortage &&
                              actualPayment?.remainingAmount && (
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mt: 0.5,
                                    px: 1,
                                    py: 0.25,
                                    bgcolor: "error.lighter",
                                    borderRadius: 1,
                                  }}
                                >
                                  <Iconify
                                    icon="mdi:arrow-down"
                                    width={14}
                                    sx={{ color: "error.main" }}
                                  />
                                  <Typography
                                    variant="caption"
                                    fontWeight="bold"
                                    color="error.main"
                                  >
                                    {actualPayment.remainingAmount.toLocaleString()}{" "}
                                    $ kam
                                  </Typography>
                                </Box>
                              )}
                            {item.isPaid &&
                              hasExcess &&
                              actualPayment?.excessAmount && (
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mt: 0.5,
                                    px: 1,
                                    py: 0.25,
                                    bgcolor: "info.lighter",
                                    borderRadius: 1,
                                  }}
                                >
                                  <Iconify
                                    icon="mdi:arrow-up"
                                    width={14}
                                    sx={{ color: "info.main" }}
                                  />
                                  <Typography
                                    variant="caption"
                                    fontWeight="bold"
                                    color="info.main"
                                  >
                                    {actualPayment.excessAmount.toLocaleString()}{" "}
                                    $ ortiqcha
                                  </Typography>
                                </Box>
                              )}
                          </Box>
                        </TableCell>

                        {/* Holat */}
                        <TableCell align="center">
                          {item.isPaid ? (
                            <Chip
                              label="To'langan"
                              color="success"
                              size="small"
                              icon={<Iconify icon="mdi:check-circle" />}
                            />
                          ) : isPast ? (
                            <Chip
                              label="Kechikkan"
                              color="error"
                              size="small"
                              icon={<Iconify icon="mdi:alert-circle" />}
                            />
                          ) : (
                            <Chip
                              label="Kutilmoqda"
                              size="small"
                              color="default"
                              variant="outlined"
                            />
                          )}
                        </TableCell>

                        {/* Amal */}
                        {contractId && (
                          <TableCell align="center">
                            {!item.isPaid && (
                              <Button
                                size="small"
                                variant="contained"
                                color={isPast ? "error" : "primary"}
                                onClick={() => handlePayment(item.amount)}
                                startIcon={<Iconify icon="mdi:cash" />}
                              >
                                To'lash
                              </Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>

                      {/* Ortiqcha to'lov xabari */}
                      {hasExcess && (
                        <TableRow
                          sx={{
                            bgcolor: "rgba(33, 150, 243, 0.08)",
                          }}
                        >
                          <TableCell colSpan={contractId ? 6 : 5}>
                            <Typography
                              variant="body2"
                              color="info.dark"
                              sx={{ py: 1, px: 2 }}
                            >
                              💰 Bu oyga{" "}
                              <strong>
                                {actualPayment.excessAmount?.toLocaleString()} $
                              </strong>{" "}
                              ortiqcha to'langan. Keyingi {item.month + 1}-oyga
                              bu summa o'tkazildi, o'sha oyga{" "}
                              <strong>
                                {(
                                  monthlyPaymentAmount -
                                  (actualPayment.excessAmount || 0)
                                ).toLocaleString()}{" "}
                                $
                              </strong>{" "}
                              to'lasa yetadi.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Kam to'lov xabari */}
                      {hasShortage && (
                        <TableRow
                          sx={{
                            bgcolor: "rgba(244, 67, 54, 0.08)",
                          }}
                        >
                          <TableCell colSpan={contractId ? 6 : 5}>
                            <Typography
                              variant="body2"
                              color="error.dark"
                              sx={{ py: 1, px: 2 }}
                            >
                              ⚠️ Bu oyga{" "}
                              <strong>
                                {actualPayment.remainingAmount?.toLocaleString()}{" "}
                                $
                              </strong>{" "}
                              yetishmayapti. Yana{" "}
                              <strong>
                                {actualPayment.remainingAmount?.toLocaleString()}{" "}
                                $
                              </strong>{" "}
                              to'lash kerak.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                });
              })()}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Xulosa */}
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "grey.100",
            borderRadius: 1,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Jami to'lovlar: {schedule.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                To'langan: {schedule.filter((s) => s.isPaid).length} |
                Kutilmoqda: {schedule.filter((s) => !s.isPaid).length}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography
                variant="body2"
                fontWeight="bold"
                color="primary.main"
              >
                Umumiy:{" "}
                {(monthlyPayment * period + initialPayment).toLocaleString()} $
              </Typography>
              <Typography variant="caption" color="success.main">
                To'langan: {totalPaid.toLocaleString()} $
              </Typography>
              {remainingDebt > 0 && (
                <Typography
                  variant="caption"
                  color="error.main"
                  display="block"
                >
                  Qolgan: {remainingDebt.toLocaleString()} $
                </Typography>
              )}
            </Box>
          </Box>

          {/* Qo'shimcha statistika */}
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {/* To'langan to'lovlar */}
            <Box flex={1} minWidth={120}>
              <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                <Iconify
                  icon="mdi:check-circle"
                  width={16}
                  color="success.main"
                />
                <Typography variant="caption" color="text.secondary">
                  To'langan
                </Typography>
              </Box>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="success.main"
              >
                {schedule.filter((s) => s.isPaid).length} ta
              </Typography>
            </Box>

            {/* Kechikkan to'lovlar */}
            <Box flex={1} minWidth={120}>
              <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                <Iconify
                  icon="mdi:alert-circle"
                  width={16}
                  color="error.main"
                />
                <Typography variant="caption" color="text.secondary">
                  Kechikkan
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight="bold" color="error.main">
                {
                  schedule.filter((s) => !s.isPaid && new Date(s.date) < today)
                    .length
                }{" "}
                ta
              </Typography>
            </Box>

            {/* Kutilayotgan to'lovlar */}
            <Box flex={1} minWidth={120}>
              <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                <Iconify
                  icon="mdi:clock-outline"
                  width={16}
                  color="warning.main"
                />
                <Typography variant="caption" color="text.secondary">
                  Kutilmoqda
                </Typography>
              </Box>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="warning.main"
              >
                {
                  schedule.filter((s) => !s.isPaid && new Date(s.date) >= today)
                    .length
                }{" "}
                ta
              </Typography>
            </Box>

            {/* Kam to'langan */}
            {payments.some(
              (p) => p.remainingAmount && p.remainingAmount > 0.01
            ) && (
              <Box flex={1} minWidth={120}>
                <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                  <Iconify icon="mdi:alert" width={16} color="warning.main" />
                  <Typography variant="caption" color="text.secondary">
                    Kam to'langan
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="warning.main"
                >
                  {
                    payments.filter(
                      (p) => p.remainingAmount && p.remainingAmount > 0.01
                    ).length
                  }{" "}
                  ta
                </Typography>
              </Box>
            )}

            {/* Ko'p to'langan */}
            {payments.some((p) => p.excessAmount && p.excessAmount > 0.01) && (
              <Box flex={1} minWidth={120}>
                <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                  <Iconify
                    icon="mdi:arrow-up-bold"
                    width={16}
                    color="info.main"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Ko'p to'langan
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold" color="info.main">
                  {
                    payments.filter(
                      (p) => p.excessAmount && p.excessAmount > 0.01
                    ).length
                  }{" "}
                  ta
                </Typography>
              </Box>
            )}
          </Box>
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
