import { db } from "@/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { TotalExpensePerCategory, TransactionPercentagePerType } from "./types";
import { auth } from "@clerk/nextjs/server";
import { endOfMonth, startOfMonth, startOfYear, setMonth } from "date-fns";

export const getDashboard = async (month: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // 1. Pegar o ano atual automaticamente
  const currentYear = new Date().getFullYear();

  // 2. Criar uma data base para o mês escolhido (month costuma ser 01 a 12)
  const monthIndex = Number(month) - 1; // date-fns usa meses de 0 a 11
  const baseDate = setMonth(new Date(currentYear, 0, 1), monthIndex);

  // 3. Definir datas exatas do mês atual (Início e Fim)
  const firstDayOfMonth = startOfMonth(baseDate);
  const lastDayOfMonth = endOfMonth(baseDate);

  // Filtro para o mês selecionado
  const where = {
    userId,
    date: {
      gte: firstDayOfMonth,
      lte: lastDayOfMonth,
    },
  };

  // 4. Definir acumulado do ano (De 01/Jan até o fim do mês selecionado)
  const firstDayOfYear = startOfYear(baseDate);

  const whereTotal = {
    userId,
    date: {
      gte: firstDayOfYear,
      lte: lastDayOfMonth,
    },
  };

  // --- BUSCAS NO BANCO ---

  const [
    depositsTotal,
    depositsTotalNoMes,
    investmentsTotal,
    investmentsTotalNoMes,
    expensesTotal,
    expensesTotalNoMes,
    transactionsTotalAggregation,
  ] = await Promise.all([
    // Totais Acumulados no Ano
    db.transaction.aggregate({
      where: { ...whereTotal, type: "DEPOSIT" },
      _sum: { amount: true },
    }),
    // Totais do Mês
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

    // Total de transações no mês para o cálculo de porcentagem
    db.transaction.aggregate({ where, _sum: { amount: true } }),
  ]);

  // Tratamento de valores (convertendo null para 0)
  const totalDeposits = Number(depositsTotal._sum.amount || 0);
  const monthDeposits = Number(depositsTotalNoMes._sum.amount || 0);
  const totalInvestments = Number(investmentsTotal._sum.amount || 0);
  const monthInvestments = Number(investmentsTotalNoMes._sum.amount || 0);
  const totalExpenses = Number(expensesTotal._sum.amount || 0);
  const monthExpenses = Number(expensesTotalNoMes._sum.amount || 0);
  const monthTransactionsTotal = Number(
    transactionsTotalAggregation._sum.amount || 0,
  );

  // --- CÁLCULOS ---

  const balance = totalDeposits - totalInvestments - totalExpenses;
  const balanceMes = monthDeposits - monthInvestments - monthExpenses;

  const typesPercentage: TransactionPercentagePerType = {
    [TransactionType.DEPOSIT]:
      monthTransactionsTotal > 0
        ? Math.round((monthDeposits / monthTransactionsTotal) * 100)
        : 0,
    [TransactionType.EXPENSE]:
      monthTransactionsTotal > 0
        ? Math.round((monthExpenses / monthTransactionsTotal) * 100)
        : 0,
    [TransactionType.INVESTMENT]:
      monthTransactionsTotal > 0
        ? Math.round((monthInvestments / monthTransactionsTotal) * 100)
        : 0,
  };

  const totalExpensePerCategory: TotalExpensePerCategory[] = (
    await db.transaction.groupBy({
      by: ["category"],
      where: { ...where, type: TransactionType.EXPENSE },
      _sum: { amount: true },
    })
  ).map((category) => ({
    category: category.category,
    totalAmount: Number(category._sum.amount),
    percentageOfTotal:
      monthExpenses > 0
        ? Math.round((Number(category._sum.amount) / monthExpenses) * 100)
        : 0,
  }));

  const lastTransactions = await db.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    take: 15,
  });

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
