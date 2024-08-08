import mysql from "mysql2/promise";
import type { Pool } from "mysql2/promise";

import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME } from "src/config";

const pool: Pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
});

export default pool;
