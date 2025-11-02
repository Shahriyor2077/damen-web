import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";
import { getPaymentHistory } from "src/store/actions/paymentActions";
import { useAppDispatch } from "src/hooks/useAppDispatch";

interface PaymentHistoryProps {
  customerId?: string;
  contractId?: string;
  title?: string;
}

interface PaymentItem {
  _id: string;
  amount: number;
  date: string;
  customerName: string;
  managerName: string;
  notes: string;
  source?: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  customerId,
  contractId,
  title = "To'lovlar Tarixi",
}) => {
  const dispatch = useAppDispatch();
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const result = (await dispatch(
          getPaymentHistory(customerId, contractId)
        )) as any;
        if (result?.status === "success") {
          setPayments(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [dispatch, customerId, contractId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd.MM.yyyy HH:mm");
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
          >
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={title}
        subheader={`Jami ${payments.length} ta to'lov`}
      />
      <CardContent>
        {payments.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            py={4}
          >
            To'lovlar tarixi mavjud emas
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Sana</TableCell>
                  <TableCell>Mijoz</TableCell>
                  <TableCell>Summa</TableCell>
                  <TableCell>Manager</TableCell>
                  <TableCell>Izoh</TableCell>
                  <TableCell>Manba</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment._id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(payment.date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {payment.customerName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="success.main"
                      >
                        {formatCurrency(payment.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {payment.managerName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {payment.notes || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          payment.source === "debtor"
                            ? "Qarzdorlik"
                            : "To'g'ridan-to'g'ri"
                        }
                        size="small"
                        color={
                          payment.source === "debtor" ? "warning" : "primary"
                        }
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
