import type { RootState } from "src/store";
import type { Column } from "src/components/table/types";

import { memo, useEffect } from "react";
import { useSelector } from "react-redux";

import { Box, Button, Tooltip, Typography } from "@mui/material";

import { useAppDispatch } from "src/hooks/useAppDispatch";

import { setModal } from "src/store/slices/modalSlice";
import { DashboardContent } from "src/layouts/dashboard";
import { getNewContracts } from "src/store/actions/contractActions";

import { Iconify } from "src/components/iconify";
import Loader from "src/components/loader/Loader";

import ContractTable from "./contactTable";

const newColumns: Column[] = [
  { id: "customerName", label: "Mijoz", sortable: true },
  { id: "productName", label: "Mahsulot Nomi", sortable: true },
  {
    id: "price",
    label: "Narxi",
    renderCell: (row) => {
      const currency = row.currency === "usd" ? "$" : "so'm";
      return `${row.price.toLocaleString()} ${currency}`;
    },
    sortable: true,
  },
  {
    id: "initialPayment",
    label: "Oldindan To'lov",
    renderCell: (row) => {
      const currency = row.currency === "usd" ? "$" : "so'm";
      return `${row.initialPayment.toLocaleString} ${currency}`;
    },
    sortable: true,
  },
  {
    id: "notes",
    label: "Izoh",
    // format: (value: number) => `${value.toLocaleString()} so'm`,
    // sortable: true,
  },
];

const ContractsView = () => {
  const dispatch = useAppDispatch();

  const { contracts, newContracts, isLoading } = useSelector(
    (state: RootState) => state.contract
  );

  useEffect(() => {
    dispatch(getNewContracts());
  }, [dispatch]);

  if (contracts.length === 0 && isLoading) {
    return <Loader />;
  }

  return (
    <DashboardContent>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="end"
        gap={3}
        mb={5}
      >
        <Typography variant="h4" flexGrow={1}>
          Shartnomalar
        </Typography>
        <Tooltip title="Shartnoma qo'shish">
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => {
              dispatch(
                setModal({
                  modal: "contractModal",
                  data: { type: "add", data: undefined },
                })
              );
            }}
          >
            Qo&apos;shish
          </Button>
        </Tooltip>
      </Box>

      <ContractTable data={newContracts} columns={newColumns} />
    </DashboardContent>
  );
};

export default memo(ContractsView);
