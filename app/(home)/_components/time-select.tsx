"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const MONTH_OPTIONS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export default function TimeSelect() {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  // 1. Pegamos o mês da URL
  const month = searchParams.get("month");

  // 2. Fallback para o mês atual formatado
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");

  const handleMonthChange = (selectedMonth: string) => {
    // 3. Importante: Use apenas o path relativo para funcionar em qualquer página
    push(`?month=${selectedMonth}`);
  };

  return (
    <Select
      onValueChange={(value) => handleMonthChange(value)}
      // 4. TROCA: Usamos 'value' em vez de 'defaultValue' para ser controlado
      value={month ?? currentMonth}
    >
      <SelectTrigger className="w-[150px] rounded-full">
        {/* O SelectValue vai mostrar o label do 'value' atual */}
        <SelectValue placeholder="Mês" />
      </SelectTrigger>
      <SelectContent>
        {MONTH_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
