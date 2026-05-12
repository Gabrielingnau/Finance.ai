import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionColumns } from "../transactions/_columns";
import AddTransactionButton from "@/_components/add-transaction-button";
import NavBar from "@/_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/_components/ui/scroll-area"; // Corrigido o path se necessário
import { canUserAddTransaction } from "@/_data/can-user-add-transaction";
import { endOfMonth, startOfMonth, setMonth } from "date-fns";
import { Transaction } from "@/_data/get-dashboard/types";

interface TransactionsPageProps {
  searchParams: {
    month?: string;
  };
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/login");
  }

  // 1. Pegamos o mês da URL ou usamos o mês atual como fallback
  const month = searchParams.month || (new Date().getMonth() + 1).toString();

  // 2. Enviamos o mês para a função de verificação
  const userCanAddTransactions = await canUserAddTransaction(month);

  // 3. Configuramos as datas para filtrar a tabela de transações
  const currentYear = new Date().getFullYear();
  const monthIndex = Number(month) - 1;
  const referenceDate = setMonth(
    new Date(currentYear, monthIndex, 1),
    monthIndex,
  );

  const startDate = startOfMonth(referenceDate);
  const endDate = endOfMonth(referenceDate);

  // 4. Busca os dados brutos do Prisma
  const transactionsFromDb = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: "desc" },
  });

  // 5. Conversão crucial: Transforma o tipo Decimal (Prisma) em Number (JS)
  // Isso garante compatibilidade com a interface Transaction que usamos nas colunas
  const transactions: Transaction[] = transactionsFromDb.map((transaction) => ({
    ...transaction,
    amount: Number(transaction.amount),
    // Garantimos que os tipos de enum batam com a nossa interface manual
    type: transaction.type as any,
    category: transaction.category as any,
    paymentMethod: transaction.paymentMethod as any,
  }));

  return (
    <>
      <NavBar />
      <div className="flex flex-col space-y-6 overflow-hidden p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton
            userCanAddTransaction={userCanAddTransactions}
          />
        </div>
        <ScrollArea className="h-full">
          {/* Agora 'transactions' é um array compatível com o tipo Transaction do frontend */}
          <DataTable columns={transactionColumns} data={transactions} />
        </ScrollArea>
      </div>
    </>
  );
}
