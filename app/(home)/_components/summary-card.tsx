import AddTransactionButton from "@/_components/add-transaction-button";
import { Card, CardContent, CardHeader } from "@/_components/ui/card";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  amountMes?: number;
  size?: "small" | "large";
  userCanAddTransaction?: boolean;
}

export default function SummaryCard({
  icon,
  title,
  amount,
  amountMes,
  size = "small",
  userCanAddTransaction,
}: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-4">
        {icon}
        <p
          className={`${size === "small" ? "text-muted-foreground" : "text-white opacity-70"}`}
        >
          {title}
        </p>
      </CardHeader>
      <CardContent className="flex justify-between">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            {size === "large" && <p>Total</p>}
            <p
              className={`font-bold ${size === "small" ? "text-2xl" : "text-2xl text-muted-foreground"}`}
            >
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(amount)}
            </p>
          </div>

          {size === "large" && (
            <div className="flex flex-col gap-1">
              <p>Mês</p>
              <p className="text-4xl font-bold">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(amountMes ? amountMes : 0)}
              </p>
            </div>
          )}
        </div>

        {size === "large" && (
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        )}
      </CardContent>
    </Card>
  );
}
