"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/_components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/_components/ui/chart";

// Importamos apenas o tipo e a constante do seu arquivo de tipos local
// Removida a importação do @prisma/client
import {
  TransactionPercentagePerType,
  TransactionType,
} from "@/_data/get-dashboard/types";

import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import PercentageItem from "./percentage-item";
import { ScrollArea } from "@/_components/ui/scroll-area";

const chartConfig = {
  INVESTMENT: {
    label: "Investido",
    color: "#FFFFFF",
  },
  DEPOSIT: {
    label: "Receita",
    color: "#55B02E",
  },
  EXPENSE: {
    label: "Despesas",
    color: "#E93030",
  },
} satisfies ChartConfig;

interface TransactionsPieChartProps {
  typesPercentage: TransactionPercentagePerType;
  depositsTotalNoMes: number;
  investmentsTotalNoMes: number;
  expensesTotalNoMes: number;
}

export default function TransactionsPieChart({
  depositsTotalNoMes,
  investmentsTotalNoMes,
  expensesTotalNoMes,
  typesPercentage,
}: TransactionsPieChartProps) {
  const chartData = [
    {
      type: "DEPOSIT",
      amount: depositsTotalNoMes,
      fill: "#55B02E",
    },
    {
      type: "EXPENSE",
      amount: expensesTotalNoMes,
      fill: "#E93030",
    },
    {
      type: "INVESTMENT",
      amount: investmentsTotalNoMes,
      fill: "#FFFFFF",
    },
  ];

  return (
    <ScrollArea>
      <Card className="flex flex-col p-6">
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="type"
                innerRadius={60}
              />
            </PieChart>
          </ChartContainer>

          <div className="space-y-3">
            <PercentageItem
              icon={<TrendingUpIcon size={16} className="text-primary" />}
              title="Receita"
              value={typesPercentage["DEPOSIT"]}
            />
            <PercentageItem
              icon={<TrendingDownIcon size={16} className="text-red-500" />}
              title="Despesas"
              value={typesPercentage["EXPENSE"]}
            />
            <PercentageItem
              icon={<PiggyBankIcon size={16} />}
              title="Investido"
              value={typesPercentage["INVESTMENT"]}
            />
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
}
