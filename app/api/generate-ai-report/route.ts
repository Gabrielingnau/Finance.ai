import { db } from "@/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { streamText } from "ai"; // Remova o LanguageModelV3 daqui
import { openai } from "@ai-sdk/openai";
import { endOfMonth, startOfMonth } from "date-fns";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  if (user.publicMetadata.subscriptionPlan !== "premium") {
    return new Response("Premium required", { status: 403 });
  }

  const { month, year } = await req.json();
  const currentYear = year || new Date().getFullYear().toString();
  const referenceDate = new Date(Number(currentYear), Number(month) - 1, 1);

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
    return new Response("Nenhuma transação encontrada.", { status: 200 });
  }

  const prompt = `Gere um relatório com insights sobre as minhas finanças do mês ${month} de ${currentYear}. 
  Transações: ${transactions.map((t: any) => `${t.date.toLocaleDateString("pt-BR")}-R$${t.amount}-${t.type}-${t.category}`).join(";")}`;

  const result = await streamText({
    model: openai("gpt-4o-mini") as any,
    system: "Você é um especialista em gestão de finanças pessoais.",
    prompt: prompt,
  });

  // Em vez de toTextStreamResponse, use toDataStreamResponse.
  // Isso resolve o erro de "Unhandled chunk type" na Vercel v14.
  return result.toDataStreamResponse();
}
