"use client";

import { Button } from "@/_components/ui/button";
import UpsertTransactionDialog from "@/_components/upsert-transaction-dialog";
// Importamos a interface Transaction do seu arquivo de tipos, removendo o @prisma/client
import { Transaction } from "@/_data/get-dashboard/types";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

interface EditTransactionButtonProps {
  transaction: Transaction;
}

export default function EditTransactionButton({
  transaction,
}: EditTransactionButtonProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        onClick={() => setDialogIsOpen(true)}
      >
        <PencilIcon />
      </Button>
      <UpsertTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        defaultValues={{
          ...transaction,
          // Garantimos que o amount seja passado como number para o formulário
          amount: Number(transaction.amount),
        }}
        transactionId={transaction.id}
      />
    </>
  );
}
