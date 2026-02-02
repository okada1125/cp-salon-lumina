import type { PrismaClient } from ".prisma/client";

function ensureDatabaseUrl(): void {
  if (process.env.DATABASE_URL) return;
  if (process.env.DB_HOST || process.env.DB_USERNAME || process.env.INSTANCE_CONNECTION_NAME) {
    const user = process.env.DB_USERNAME ?? "";
    const password = encodeURIComponent(process.env.DB_PASSWORD ?? "");
    const database = process.env.DB_DATABASE ?? "";

    // Cloud Run + Cloud SQL: Unix ソケット接続
    if (process.env.INSTANCE_CONNECTION_NAME) {
      const instance = process.env.INSTANCE_CONNECTION_NAME.trim();
      process.env.DATABASE_URL = `mysql://${user}:${password}@localhost/${database}?socketPath=/cloudsql/${instance}`;
    } else {
      // TCP 接続
      const host = process.env.DB_HOST ?? "127.0.0.1";
      const port = process.env.DB_PORT ?? "3306";
      process.env.DATABASE_URL = `mysql://${user}:${password}@${host}:${port}/${database}`;
    }
  } else {
    process.env.DATABASE_URL = "mysql://localhost:3306/placeholder";
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

async function getPrisma(): Promise<PrismaClient> {
  ensureDatabaseUrl();
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const { PrismaClient } = await import(".prisma/client");
  globalForPrisma.prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
  return globalForPrisma.prisma;
}

export { getPrisma };
