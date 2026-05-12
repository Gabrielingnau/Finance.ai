import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionColumns } from "../transactions/_columns";
import AddTransactionButton from "@/_components/add-transaction-button";
import NavBar from "@/_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { canUserAddTransaction } from "@/_data/can-user-add-transaction";
import { endOfMonth, startOfMonth, setMonth } from "date-fns";

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
  // Nota: O mês na URL (1-12) deve ser passado para a função
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

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: "desc" },
  });

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
          <DataTable columns={transactionColumns} data={transactions} />
        </ScrollArea>
      </div>
    </>
  );
}
