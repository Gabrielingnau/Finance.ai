"use client";

import { Button } from "@/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/_components/ui/dialog";
import { BotIcon, Loader2Icon } from "lucide-react";
import { ScrollArea } from "@/_components/ui/scroll-area";
import Markdown from "react-markdown";
import Link from "next/link";
import { useCompletion } from "ai/react";

interface AiReportButtonProps {
  hasPremiumPlan: boolean;
  month: string;
  year: string;
}

export default function AiReportButton({
  month,
  year,
  hasPremiumPlan,
}: AiReportButtonProps) {
  // O useCompletion gerencia o streaming automaticamente
  const { completion, complete, isLoading, setCompletion } = useCompletion({
    api: "/api/generate-ai-report",
    onError: (error) => {
      console.error("Erro ao gerar relatório:", error);
    },
  });

  const handleGenerateReportClick = async () => {
    try {
      // O primeiro argumento é o prompt (vazio pois o prompt real é montado na API)
      // O segundo envia os dados no corpo da requisição POST
      await complete("", {
        body: { month, year },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          // Limpa o relatório ao fechar o modal
          setCompletion("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">
          Relatório IA
          <BotIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        {hasPremiumPlan ? (
          <>
            <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>
              <DialogDescription>
                Use inteligência artificial para gerar um relatório com insights
                sobre suas finanças de {month}/{year}.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="prose max-h-[450px] text-white prose-h3:text-white prose-h4:text-white prose-strong:text-white">
              {/* O 'completion' contém o texto que está sendo gerado em tempo real */}
              <Markdown>
                {completion ||
                  "Clique no botão abaixo para analisar seus dados."}
              </Markdown>
            </ScrollArea>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleGenerateReportClick} disabled={isLoading}>
                {isLoading && <Loader2Icon className="animate-spin" />}
                {isLoading ? "Gerando..." : "Gerar relatório"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>
              <DialogDescription>
                Você precisa de um plano premium para gerar relatórios com IA.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button asChild>
                <Link href="/subscription">Assinar plano premium</Link>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
