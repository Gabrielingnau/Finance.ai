// Removida a importação do @prisma/client
// Importamos os tipos do seu arquivo local para manter a tipagem forte no VS Code
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@/_data/get-dashboard/types";

export const TRANSACTION_PAYMENT_METHOD_ICONS = {
  CREDIT_CARD: "credit-card.svg",
  DEBIT_CARD: "debit-card.svg",
  BANK_TRANSFER: "bank-transfer.svg",
  BANK_SLIP: "bank-slip.svg",
  CASH: "money.svg",
  PIX: "pix.svg",
  OTHER: "other.svg",
};

export const TRANSACTION_CATEGORY_LABELS = {
  EDUCATION: "Educação",
  ENTERTAINMENT: "Entretenimento",
  FOOD: "Alimentação",
  HEALTH: "Saúde",
  HOUSING: "Moradia",
  OTHER: "Outros",
  SALARY: "Salário",
  TRANSPORTATION: "Transporte",
  UTILITY: "Utilidades",
};

export const TRANSACTION_PAYMENT_METHOD_LABELS = {
  BANK_TRANSFER: "Transferência Bancária",
  BANK_SLIP: "Boleto Bancário",
  CASH: "Dinheiro",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  OTHER: "Outros",
  PIX: "Pix",
};

export const TRANSACTION_TYPE_OPTIONS = [
  {
    value: "EXPENSE" as TransactionType,
    label: "Despesa",
  },
  {
    value: "DEPOSIT" as TransactionType,
    label: "Depósito",
  },
  {
    value: "INVESTMENT" as TransactionType,
    label: "Investimento",
  },
];

export const TRANSACTION_PAYMENT_METHOD_OPTIONS = [
  {
    value: "BANK_TRANSFER" as TransactionPaymentMethod,
    label: TRANSACTION_PAYMENT_METHOD_LABELS.BANK_TRANSFER,
  },
  {
    value: "BANK_SLIP" as TransactionPaymentMethod,
    label: TRANSACTION_PAYMENT_METHOD_LABELS.BANK_SLIP,
  },
  {
    value: "CASH" as TransactionPaymentMethod,
    label: TRANSACTION_PAYMENT_METHOD_LABELS.CASH,
  },
  {
    value: "CREDIT_CARD" as TransactionPaymentMethod,
    label: TRANSACTION_PAYMENT_METHOD_LABELS.CREDIT_CARD,
  },
  {
    value: "DEBIT_CARD" as TransactionPaymentMethod,
    label: TRANSACTION_PAYMENT_METHOD_LABELS.DEBIT_CARD,
  },
  {
    value: "OTHER" as TransactionPaymentMethod,
    label: TRANSACTION_PAYMENT_METHOD_LABELS.OTHER,
  },
  {
    value: "PIX" as TransactionPaymentMethod,
    label: TRANSACTION_PAYMENT_METHOD_LABELS.PIX,
  },
];

export const TRANSACTION_CATEGORY_OPTIONS = [
  {
    value: "EDUCATION" as TransactionCategory,
    label: TRANSACTION_CATEGORY_LABELS.EDUCATION,
  },
  {
    value: "ENTERTAINMENT" as TransactionCategory,
    label: TRANSACTION_CATEGORY_LABELS.ENTERTAINMENT,
  },
  {
    value: "FOOD" as TransactionCategory,
    label: TRANSACTION_CATEGORY_LABELS.FOOD,
  },
  {
    value: "HEALTH" as TransactionCategory,
    label: TRANSACTION_CATEGORY_LABELS.HEALTH,
  },
  {
    value: "HOUSING" as TransactionCategory,
    label: TRANSACTION_CATEGORY_LABELS.HOUSING,
  },
  {
    value: "OTHER" as TransactionCategory,
    label: TRANSACTION_CATEGORY_LABELS.OTHER,
  },
  {
    value: "SALARY" as TransactionCategory,
    label: TRANSACTION_CATEGORY_LABELS.SALARY,
  },
  {
    value: "TRANSPORTATION" as TransactionCategory,
    label: TRANSACTION_CATEGORY_LABELS.TRANSPORTATION,
  },
  {
    value: "UTILITY" as TransactionCategory,
    label: TRANSACTION_CATEGORY_LABELS.UTILITY,
  },
];
