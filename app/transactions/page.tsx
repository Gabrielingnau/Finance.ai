import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionColumns } from "../transactions/_columns";
import AddTransactionButton from "@/_components/add-transaction-button";
import NavBar from "@/_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { canUserAddTransaction } from "@/_data/can-user-add-transaction";
import { endOfMonth, startOfMonth } from "date-fns";

export default async function TransactionsPage() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/login");
  }
  const userCanAddTransactions = await canUserAddTransaction();

  const currentDate = new Date();

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);

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
      <div className="space-y-6 overflow-hidden p-6">
        {/* TÍTULO E BOTÃO */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton
            userCanAddTransaction={userCanAddTransactions}
          />
        </div>
        <ScrollArea>
          <DataTable columns={transactionColumns} data={transactions} />
        </ScrollArea>
      </div>
    </>
  );
}
