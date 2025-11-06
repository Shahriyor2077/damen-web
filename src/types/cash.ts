export type CurrencyDetails = {
  dollar: number;
  sum: number;
  hasCurrencyRate?: boolean;
  currencyRate?: number | null;
};

export interface ICash {
  _id: string;
  fullName: string;
  phoneNumber: string;
  debtAmount: number;
  paidAmount: number;
  manager: string;
  status: string;
  overdueDays: number;
  notes: string;
  currencyDetails?: CurrencyDetails; // YANGI - optional
  currencyCourse?: number; // YANGI - optional
}

// Yangi interface - Debtor uchun
export interface IDebtor {
  _id: string;
  contractId: string;
  debtAmount: number;
  dueDate: Date; // YANGI
  overdueDays: number; // YANGI
  createBy: string;
  createdAt: Date;
  updatedAt: Date;
}
