import mysql from "mysql2/promise";

/**
 * scraping-tool と同じ DB 接続設定
 * DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT を使用
 * Cloud Run + Cloud SQL の場合は INSTANCE_CONNECTION_NAME で socketPath
 */
function getConnectionConfig(): mysql.ConnectionOptions {
  const base = {
    user: process.env.DB_USERNAME ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_DATABASE ?? "salon_lumina_register",
  };

  if (process.env.INSTANCE_CONNECTION_NAME) {
    return {
      ...base,
      host: "localhost",
      socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME.trim()}`,
    };
  }

  return {
    ...base,
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
  };
}

let pool: mysql.Pool | null = null;

export function getDb(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(getConnectionConfig());
  }
  return pool;
}

export async function executeQuery<T = mysql.RowDataPacket[]>(
  sql: string,
  params?: unknown[]
): Promise<T> {
  const [rows] = await getDb().execute(sql, params);
  return rows as T;
}
