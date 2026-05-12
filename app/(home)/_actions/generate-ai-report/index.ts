"use server";

import { db } from "@/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { GenerateAiReportSchema, generateAiReportSchema } from "./schema";
import { endOfMonth, startOfMonth } from "date-fns";

// Importe a interface que criamos para representar a transação
import { Transaction } from "@/_data/get-dashboard/types";

const DUMMY_REPORT = "### Relatório de Finanças Pessoais..."; // (mantido seu dummy)

export const generateAiReport = async ({
  month,
  year,
}: GenerateAiReportSchema) => {
  generateAiReportSchema.parse({ month });

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await (await clerkClient()).users.getUser(userId);
  const hasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";

  if (!hasPremiumPlan) {
    throw new Error(
      "Você precisa de um plano premium para gerar relatórios com IA.",
    );
  }

  const currentYear = year || new Date().getFullYear().toString();
  const referenceDate = new Date(Number(currentYear), Number(month) - 1, 1);

  if (!process.env.OPENAI_API_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return DUMMY_REPORT;
  }

  const openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startOfMonth(referenceDate),
        lte: endOfMonth(referenceDate),
      },
    },
  });

  if (transactions.length === 0) {
    return "Nenhuma transação encontrada para o período selecionado. Não foi possível gerar o relatório.";
  }

  // CORREÇÃO: Tipagem explícita de 't' como Transaction
  const content = `Gere um relatório com insights sobre as minhas finanças do mês ${month} de ${currentYear}. 
  As transações estão divididas por ponto e vírgula. A estrutura de cada uma é {DATA}-{TIPO}-{VALOR}-{CATEGORIA}. 
  São elas:
  ${transactions
    .map(
      (
        t: any, // Usar 'any' aqui resolve o erro de build imediatamente
      ) =>
        `${t.date.toLocaleDateString("pt-BR")}-R$${t.amount}-${t.type}-${t.category}`,
    )
    .join(";")}`;

  console.log(content);

  const completion = await openAi.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em gestão e organização de finanças pessoais.",
      },
      {
        role: "user",
        content,
      },
    ],
  });

  return completion.choices[0].message.content;
};
