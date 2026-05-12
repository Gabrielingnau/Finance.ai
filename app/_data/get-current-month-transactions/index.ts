import { db } from "@/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { endOfMonth, startOfMonth, setMonth } from "date-fns";

export const getTransactionsCount = async (month: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // 1. Obtém o ano atual automaticamente
  const currentYear = new Date().getFullYear();

  // 2. Cria a data de referência baseada no mês solicitado (1-12)
  // Usamos o dia 1 para evitar problemas com meses que têm menos dias que hoje
  const monthIndex = Number(month) - 1;
  const referenceDate = setMonth(
    new Date(currentYear, monthIndex, 1),
    monthIndex,
  );

  // 3. Retorna a contagem filtrando exatamente pelo início e fim do mês
  return db.transaction.count({
    where: {
      userId,
      date: {
        gte: startOfMonth(referenceDate),
        lte: endOfMonth(referenceDate),
      },
    },
  });
};
