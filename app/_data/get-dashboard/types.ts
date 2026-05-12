export type TransactionPercentagePerType = {
  [key in "DEPOSIT" | "EXPENSE" | "INVESTMENT"]: number;
};

export type TransactionType = "INVESTMENT" | "DEPOSIT" | "EXPENSE";
export interface TotalExpensePerCategory {
  category:
    | "HOUSING"
    | "TRANSPORTATION"
    | "FOOD"
    | "ENTERTAINMENT"
    | "HEALTH"
    | "UTILITY"
    | "SALARY"
    | "EDUCATION"
    | "OTHER";
  totalAmount: number;
  percentageOfTotal: number;
}

// @/_data/get-dashboard/types.ts

export type TransactionCategory =
  | "HOUSING"
  | "TRANSPORTATION"
  | "FOOD"
  | "ENTERTAINMENT"
  | "HEALTH"
  | "UTILITY"
  | "SALARY"
  | "EDUCATION"
  | "OTHER";

export type TransactionPaymentMethod =
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "BANK_TRANSFER"
  | "BANK_SLIP"
  | "CASH"
  | "PIX"
  | "OTHER";

export interface TotalExpensePerCategory {
  category: TransactionCategory;
  totalAmount: number;
  percentageOfTotal: number;
}

// Interface útil para usar nos componentes de tabela e badges
export interface Transaction {
  id: string;
  name: string;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}
