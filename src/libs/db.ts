import mysql from "mysql2/promise";
import type { Pool, PoolConnection } from "mysql2/promise";

import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME } from "src/config";

export interface DBResponse {
  db: PoolConnection | null;
  error: any;
}

const DBConnection = async (): Promise<DBResponse> => {
  try {
    const pool: Pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
    });
    const db: PoolConnection = await pool.getConnection();
    return {
      db,
      error: null,
    };
  } catch (error) {
    console.error("DB Connection Error", error);
    return {
      db: null,
      error,
    };
  }
};

export default DBConnection;
