import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * Criamos uma interface para o objeto global para evitar
 * erros de "any" implícito e garantir tipagem no desenvolvimento.
 */
interface CustomNodeJsGlobal {
  prisma: PrismaClient | undefined;
}

declare const global: CustomNodeJsGlobal;

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

/**
 * Instanciamos o db. Em produção, sempre criamos uma nova instância
 * (com o adapter do Neon). Em desenvolvimento, usamos o cache global
 * para não estourar o limite de conexões do banco.
 */
export const db =
  global.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}
