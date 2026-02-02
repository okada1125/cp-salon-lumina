import { PrismaClient } from "@prisma/client";

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.DB_HOST || process.env.INSTANCE_CONNECTION_NAME) {
    const user = process.env.DB_USERNAME ?? "";
    const password = encodeURIComponent(process.env.DB_PASSWORD ?? "");
    const database = process.env.DB_DATABASE ?? "";

    // Cloud Run + Cloud SQL: Unixソケット接続（推奨）
    if (process.env.INSTANCE_CONNECTION_NAME) {
      const instance = process.env.INSTANCE_CONNECTION_NAME.trim();
      return `mysql://${user}:${password}@localhost/${database}?socketPath=/cloudsql/${instance}`;
    }

    // TCP接続（127.0.0.1:3306 等）
    const host = process.env.DB_HOST ?? "127.0.0.1";
    const port = process.env.DB_PORT ?? "3306";
    return `mysql://${user}:${password}@${host}:${port}/${database}`;
  }
  // ビルド時はDB接続不要のためダミーURLを返す
  return "mysql://localhost:3306/placeholder";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: { db: { url: getDatabaseUrl() } },
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
