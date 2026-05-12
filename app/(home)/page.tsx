import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import TransactionsPieChart from "./_components/transactions-pie-chart";
import { getDashboard } from "../_data/get-dashboard";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transactions";
import { canUserAddTransaction } from "@/_data/can-user-add-transaction";
import AiReportButton from "./_components/ai-report-button";

// app/(home)/page.tsx

interface HomeProps {
  searchParams: {
    month: string;
  };
}

export default async function Home({ searchParams: { month } }: HomeProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  // 1. Validação simplificada: apenas verifica se o mês existe
  // Não usamos isMatch aqui para evitar erro com meses de 1 dígito (ex: "5")
  const monthIsInvalid = !month || Number(month) < 1 || Number(month) > 12;

  if (monthIsInvalid) {
    const currentMonth = (new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0");
    // Redireciona apenas com o mês, sem forçar o ano na URL se não quiser
    redirect(`?month=${currentMonth}`);
  }

  // 2. Chamadas de dados atualizadas (passando apenas o mês)
  const dashboard = await getDashboard(month);
  const userCanAddTransactions = await canUserAddTransaction(month);

  const user = await (await clerkClient()).users.getUser(userId);
  const hasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";

  // Pegamos o ano apenas para passar para o botão de IA se ele ainda pedir
  const currentYear = new Date().getFullYear().toString();

  return (
    <>
      <Navbar />
      <div className="flex h-full flex-col space-y-6 overflow-hidden p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex w-full justify-end gap-3">
            <AiReportButton
              month={month}
              year={currentYear}
              hasPremiumPlan={hasPremiumPlan}
            />
            <TimeSelect />
          </div>
        </div>

        <div className="grid h-full grid-cols-[2fr,1fr] gap-6 overflow-hidden">
          <div className="flex flex-col gap-6 overflow-hidden">
            <SummaryCards
              month={month}
              userCanAddTransaction={userCanAddTransactions}
              {...dashboard}
            />
            <div className="grid h-full grid-cols-3 grid-rows-1 gap-6 overflow-hidden">
              <TransactionsPieChart {...dashboard} />
              <ExpensesPerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
              />
            </div>
          </div>
          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  );
}
