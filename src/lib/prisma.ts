import { PrismaClient } from ".prisma/client";

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.DB_HOST || process.env.DB_USERNAME) {
    const user = process.env.DB_USERNAME ?? "";
    const password = encodeURIComponent(process.env.DB_PASSWORD ?? "");
    const database = process.env.DB_DATABASE ?? "";
    // Cloud Run + Cloud SQL: TCP接続（Cloud SQL Proxy が 127.0.0.1:3306 で待機）
    const host = process.env.DB_HOST ?? "127.0.0.1";
    const port = process.env.DB_PORT ?? "3306";
    return `mysql://${user}:${password}@${host}:${port}/${database}`;
  }
  // ビルド時はDB接続不要のためダミーURLを返す
  return "mysql://localhost:3306/placeholder";
}

// Prisma が schema の env("DATABASE_URL") を検証するため、事前に設定する
const databaseUrl = getDatabaseUrl();
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: { db: { url: databaseUrl } },
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
