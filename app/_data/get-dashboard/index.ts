import { db } from "@/_lib/prisma";
import { TotalExpensePerCategory, TransactionPercentagePerType } from "./types";
import { auth } from "@clerk/nextjs/server";
import { endOfMonth, startOfMonth, startOfYear, setMonth } from "date-fns";
// Importamos os tipos do seu arquivo centralizado para evitar erros de build
import { TransactionType } from "@/_data/get-dashboard/types";

export const getDashboard = async (month: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const currentYear = new Date().getFullYear();
  const monthIndex = Number(month) - 1;
  const baseDate = setMonth(new Date(currentYear, 0, 1), monthIndex);

  const firstDayOfMonth = startOfMonth(baseDate);
  const lastDayOfMonth = endOfMonth(baseDate);

  const where = {
    userId,
    date: {
      gte: firstDayOfMonth,
      lte: lastDayOfMonth,
    },
  };

  const firstDayOfYear = startOfYear(baseDate);

  const whereTotal = {
    userId,
    date: {
      gte: firstDayOfYear,
      lte: lastDayOfMonth,
    },
  };

  const [
    depositsTotal,
    depositsTotalNoMes,
    investmentsTotal,
    investmentsTotalNoMes,
    expensesTotal,
    expensesTotalNoMes,
    transactionsTotalAggregation,
  ] = await Promise.all([
    db.transaction.aggregate({
      where: { ...whereTotal, type: "DEPOSIT" },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: { ...where, type: "DEPOSIT" },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: { ...whereTotal, type: "INVESTMENT" },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: { ...where, type: "INVESTMENT" },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: { ...whereTotal, type: "EXPENSE" },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: { ...where, type: "EXPENSE" },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({ where, _sum: { amount: true } }),
  ]);

  const totalDeposits = Number(depositsTotal._sum.amount || 0);
  const monthDeposits = Number(depositsTotalNoMes._sum.amount || 0);
  const totalInvestments = Number(investmentsTotal._sum.amount || 0);
  const monthInvestments = Number(investmentsTotalNoMes._sum.amount || 0);
  const totalExpenses = Number(expensesTotal._sum.amount || 0);
  const monthExpenses = Number(expensesTotalNoMes._sum.amount || 0);
  const monthTransactionsTotal = Number(
    transactionsTotalAggregation._sum.amount || 0,
  );

  const balance = totalDeposits - totalInvestments - totalExpenses;
  const balanceMes = monthDeposits - monthInvestments - monthExpenses;

  const typesPercentage: TransactionPercentagePerType = {
    DEPOSIT:
      monthTransactionsTotal > 0
        ? Math.round((monthDeposits / monthTransactionsTotal) * 100)
        : 0,
    EXPENSE:
      monthTransactionsTotal > 0
        ? Math.round((monthExpenses / monthTransactionsTotal) * 100)
        : 0,
    INVESTMENT:
      monthTransactionsTotal > 0
        ? Math.round((monthInvestments / monthTransactionsTotal) * 100)
        : 0,
  };

  // CORREÇÃO: Tipamos o retorno do groupBy como 'any' ou uma interface específica para o map funcionar
  const totalExpensePerCategory: TotalExpensePerCategory[] = (
    await db.transaction.groupBy({
      by: ["category"],
      where: { ...where, type: "EXPENSE" },
      _sum: { amount: true },
    })
  ).map((category: any) => ({
    category: category.category,
    totalAmount: Number(category._sum.amount),
    percentageOfTotal:
      monthExpenses > 0
        ? Math.round((Number(category._sum.amount) / monthExpenses) * 100)
        : 0,
  }));

  const lastTransactionsFromDb = await db.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    take: 15,
  });

  // Garantimos que o array de transações também siga a interface manual (Decimal -> Number)
  const lastTransactions = lastTransactionsFromDb.map((t) => ({
    ...t,
    amount: Number(t.amount),
  }));

  return {
    balance,
    balanceMes,
    depositsTotalNoMes: monthDeposits,
    depositsTotal: totalDeposits,
    investmentsTotalNoMes: monthInvestments,
    investmentsTotal: totalInvestments,
    expensesTotalNoMes: monthExpenses,
    expensesTotal: totalExpenses,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions,
  };
};
