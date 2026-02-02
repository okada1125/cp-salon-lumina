/**
 * Prisma の import より先に DATABASE_URL を設定する。
 * env("DATABASE_URL") の検証が import 時に走るため、このファイルを最初に import すること。
 */
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
