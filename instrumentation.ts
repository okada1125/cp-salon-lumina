/**
 * アプリ起動前に実行される。DATABASE_URL を DB_* から構築して設定する。
 * Prisma は import 時に env("DATABASE_URL") を検証するため、これより先に実行される必要がある。
 */
export async function register() {
  if (!process.env.DATABASE_URL) {
    if (process.env.DB_HOST || process.env.DB_USERNAME) {
      const user = process.env.DB_USERNAME ?? "";
      const password = encodeURIComponent(process.env.DB_PASSWORD ?? "");
      const database = process.env.DB_DATABASE ?? "";
      const host = process.env.DB_HOST ?? "127.0.0.1";
      const port = process.env.DB_PORT ?? "3306";
      process.env.DATABASE_URL = `mysql://${user}:${password}@${host}:${port}/${database}`;
    } else {
      process.env.DATABASE_URL = "mysql://localhost:3306/placeholder";
    }
  }
}
