import { PrismaClient } from "@prisma/client";

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.DB_HOST) {
    const user = process.env.DB_USERNAME ?? "";
    const password = encodeURIComponent(process.env.DB_PASSWORD ?? "");
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT ?? "3306";
    const database = process.env.DB_DATABASE ?? "";
    return `mysql://${user}:${password}@${host}:${port}/${database}`;
  }
  throw new Error(
    "Database URL not configured. Set DATABASE_URL or DB_HOST/DB_USERNAME/DB_PASSWORD/DB_DATABASE."
  );
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: { db: { url: getDatabaseUrl() } },
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
