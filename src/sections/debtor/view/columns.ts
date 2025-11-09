import type { Column } from "src/components/table/types";

export const columnsDebtor: Column[] = [
  { id: "fullName", label: "Ism-Familiya", sortable: true },
  // { id: "phoneNumber", label: "Telefon raqami", sortable: true },
  {
    id: "activeContractsCount",
    label: "Faol shartnomalar",
    align: "center",
    format: (value: number) => `${value.toLocaleString()}`,
    sortable: true,
  },
  {
    id: "totalPrice",
    label: "Umumiy narxi",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },
  {
    id: "totalPaid",
    label: "To'langan summa",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },
  {
    id: "remainingDebt",
    label: "Qoldiq summa",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },
  {
    id: "nextPaymentDate",
    label: "Keyingi to'lov sanasi",
    format: (value: number) => (value ? value.toString().split("T")[0] : ""),
    sortable: true,
  },
  { id: "manager", label: "Menejer" },
];

export const columnsContract: Column[] = [
  {
    id: "contractDay",
    label: "Kun",
    sortable: false,
    renderCell: (row) => {
      const day = new Date(row.startDate).getDate();
      return day.toString();
    },
  },
  { id: "fullName", label: "Ism-Familiya", sortable: true },
  { id: "productName", label: "Mahsulot nomi", sortable: true },
  {
    id: "totalPrice",
    label: "Ummumiy narxi",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },
  {
    id: "initialPayment",
    label: "Oldindan to'lov",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },
  {
    id: "totalPaid",
    label: "To'langan summa",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },
  {
    id: "remainingDebt",
    label: "Qoldiq summa",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },
  {
    id: "startDate",
    label: "Shartnoma sanasi",
    format: (value: number) => (value ? value.toString().split("T")[0] : ""),

    sortable: true,
  },
  {
    id: "nextPaymentDate",
    label: "Keyingi to'lov sanasi",
    format: (value: number) => (value ? value.toString().split("T")[0] : ""),

    sortable: true,
  },
  {
    id: "delayDays",
    label: "Kechikish kunlari",
    sortable: true,
    renderCell: (row) => {
      const delayDays = row.delayDays || 0;

      if (delayDays <= 0) {
        return "—";
      }

      // Rang va emoji
      if (delayDays > 30) {
        return `🔴 ${delayDays} kun`;
      } else if (delayDays > 7) {
        return `🟡 ${delayDays} kun`;
      }
      return `🟢 ${delayDays} kun`;
    },
  },
  { id: "manager", label: "Menejer", sortable: true },
];
