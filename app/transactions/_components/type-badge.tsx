import { Badge } from "@/_components/ui/badge";
import { CircleIcon } from "lucide-react";

// Importamos o tipo que definimos manualmente no seu arquivo de tipos
import { TransactionType } from "@/_data/get-dashboard/types";

// Definimos uma interface local para a transação para evitar o import de "@prisma/client"
interface Transaction {
  type: TransactionType;
  // adicione outros campos se necessário, ou use 'any' se for apenas para o badge
}

interface TransactionTypeBadgeProps {
  transaction: Transaction;
}

export default function TransactionTypeBadge({
  transaction,
}: TransactionTypeBadgeProps) {
  if (transaction.type === "DEPOSIT") {
    return (
      <Badge className="bg-muted font-bold text-primary hover:bg-muted">
        <CircleIcon className="mr-2 fill-primary" size={10} />
        Depósito
      </Badge>
    );
  }
  if (transaction.type === "EXPENSE") {
    return (
      <Badge className="bg-muted font-bold text-destructive hover:bg-muted">
        <CircleIcon className="mr-2 fill-destructive" size={10} />
        Despesa
      </Badge>
    );
  }
  return (
    <Badge className="bg-muted font-bold text-white hover:bg-muted">
      <CircleIcon className="mr-2 fill-white" size={10} />
      Investimento
    </Badge>
  );
}
