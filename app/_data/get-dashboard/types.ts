export type TransactionPercentagePerType = {
  [key in "DEPOSIT" | "EXPENSE" | "INVESTMENT"]: number;
};

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
