import type { Column } from "src/components/table/types";

export const columnsPageContract: Column[] = [
  {
    id: "customerName",
    label: "Mijoz",
    sortable: true,
    // renderCell: (row) => {
    //   const currency = row.currency === "usd" ? "$" : "so'm";
    //   return `${row.initialPaymentDueDate} ${row.customerName}`;
    // },
    // renderCell: (row) => {
    //   const day = new Date(row.initialPaymentDueDate).getDate(); // faqat kunni oladi
    //   return `${day} ${row.customerName}`;
    // },
  },
  { id: "productName", label: "Mahsulot Nomi", sortable: true },
  {
    id: "startDate",
    label: "Shartnoma Sanasi",
    format: (value: number) => value.toString().split("T")[0],
    sortable: true,
  },
  {
    id: "totalPrice",
    label: "Narxi",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },
  {
    id: "initialPayment",
    label: "Oldindan To'lov",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },

  {
    id: "monthlyPayment",
    label: "Oylik To'lov Miqdori",
    align: "center",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },
  {
    id: "totalPaid",
    label: "To'langan",
    align: "center",
    format: (value: number) => `${value?.toLocaleString() || 0} $`,
    sortable: true,
  },
  {
    id: "remainingDebt",
    label: "Qolgan qarz",
    align: "center",
    format: (value: number) => `${value?.toLocaleString() || 0} $`,
    sortable: true,
  },
];

export const columnsPageNewContract: Column[] = [
  { id: "productName", label: "Mahsulot Nomi", sortable: true },
  { id: "customerName", label: "Mijoz", sortable: true },
  { id: "sellerName", label: "Seller", sortable: true },
  {
    id: "price",
    label: "Narxi",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },
  {
    id: "initialPayment",
    label: "Oldindan To'lov",
    format: (value: number) => `${value.toLocaleString()} $`,
    sortable: true,
  },
  {
    id: "notes",
    label: "Izoh",
  },
  {
    id: "actions",
    label: "Amallar",
    align: "center",
  },
];
