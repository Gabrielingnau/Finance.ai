import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SummaryCard from "./summary-card";

interface SummaryCards {
  month: string;
  balance: number;
  balanceMes: number;
  depositsTotalNoMes: number;
  investmentsTotalNoMes: number;
  expensesTotalNoMes: number;
  userCanAddTransaction?: boolean;
}

export default async function SummaryCards({
  balance,
  balanceMes,
  depositsTotalNoMes,
  expensesTotalNoMes,
  investmentsTotalNoMes,
  userCanAddTransaction,
}: SummaryCards) {
  return (
    <div className="space-y-6">
      {/* PRIMEIRO CARD */}

      <SummaryCard
        icon={<WalletIcon size={16} />}
        title="Saldo"
        amount={balance}
        amountMes={balanceMes}
        size="large"
        userCanAddTransaction={userCanAddTransaction}
      />

      {/* OUTROS CARDS */}
      <div className="grid grid-cols-3 gap-6">
        <SummaryCard
          icon={<PiggyBankIcon size={16} />}
          title="Investido"
          amount={investmentsTotalNoMes}
        />
        <SummaryCard
          icon={<TrendingUpIcon size={16} className="text-primary" />}
          title="Receita"
          amount={depositsTotalNoMes}
        />
        <SummaryCard
          icon={<TrendingDownIcon size={16} className="text-red-500" />}
          title="Despesas"
          amount={expensesTotalNoMes}
        />
      </div>
    </div>
  );
}
