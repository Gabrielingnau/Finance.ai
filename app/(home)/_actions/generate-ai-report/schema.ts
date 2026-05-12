import { isMatch } from "date-fns";
import { z } from "zod";

export const generateAiReportSchema = z.object({
  month: z.string().refine((value) => isMatch(value, "MM"), {
    message: "O mês deve estar no formato MM (ex: 01 a 12)",
  }),
  year: z
    .string()
    .refine((value) => isMatch(value, "yyyy"), {
      message: "O ano deve estar no formato yyyy (ex: 2024)",
    })
    .optional(), // Opcional: se não enviar, a action usa o ano atual
});

export type GenerateAiReportSchema = z.infer<typeof generateAiReportSchema>;
