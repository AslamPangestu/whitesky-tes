import type { FieldPacket, PoolConnection, QueryResult } from "mysql2/promise";

import type { NewsType } from "src/models/NewsModel";
import type PaginationInterface from "src/libs/interfaces/pagination";

interface IRepository {
  data: any;
  error: any;
}

interface INewsRepository {
  find(pagination: PaginationInterface): Promise<IRepository>;
  findBySlug(slug: string): Promise<IRepository>;
}

class NewsRepository implements INewsRepository {
  private pool: PoolConnection;

  constructor(pool: PoolConnection) {
    this.pool = pool;
  }

  find = async (pagination: PaginationInterface): Promise<IRepository> => {
    try {
      const columns = pagination.fields?.length
        ? pagination.fields.join(",")
        : "*";
      let rawQuery = `SELECT ${columns} FROM news ORDER BY id`;
      if (pagination.page) {
        rawQuery += ` LIMIT ${pagination.limit} OFFSET (${pagination.page} - 1) * ${pagination.limit}`;
      }
      const query: [QueryResult, FieldPacket[]] =
        await this.pool.execute(rawQuery);
      const result = query[0] as Array<NewsType>;
      return { data: result, error: null };
    } catch (error) {
      console.error("Find News Error", error);
      return { data: null, error };
    }
  };

  findBySlug = async (slug: string): Promise<IRepository> => {
    try {
      const query: [QueryResult, FieldPacket[]] = await this.pool.execute(
        "SELECT * FROM news WHERE slug = ?",
        [slug],
      );
      const result = query[0] as Array<NewsType>;
      return { data: result, error: null };
    } catch (error) {
      console.error("Find By ID News Error", error);
      return { data: null, error };
    }
  };
}

export default NewsRepository;
