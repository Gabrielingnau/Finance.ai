import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Esta parte ajuda o TS a entender o global sem erros de compilação
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Criamos a conexão com o Neon
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Instanciamos o Prisma passando o adapter
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
