import { PrismaClient } from "@prisma/client";

// DB_* 環境変数から DATABASE_URL を構築（パスワードを URL エンコードして特殊文字を正しく扱う）
if (process.env.DB_HOST) {
  const user = process.env.DB_USERNAME ?? "";
  const password = encodeURIComponent(process.env.DB_PASSWORD ?? "");
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT ?? "3306";
  const database = process.env.DB_DATABASE ?? "";
  process.env.DATABASE_URL = `mysql://${user}:${password}@${host}:${port}/${database}`;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
