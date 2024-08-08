import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { PoolConnection } from "mysql2/promise";

import pool from "src/libs/db";
import NewsRepository from "src/repositories/NewsRepository";

import type PaginationInterface from "src/libs/interfaces/pagination";
import type { NewsType } from "src/models/NewsModel";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");
  const feature = searchParams.get("feature");

  const db: PoolConnection = await pool.getConnection();
  const repo: NewsRepository = new NewsRepository(db);

  const payload: PaginationInterface = {
    page: page ? parseInt(page, 10) : 0,
    limit: 20,
  };

  if (feature === "slug") {
    payload.fields = ["slug"];
    payload.limit = 0;
  }

  const { data, error } = await repo.find(payload);
  if (error) {
    return NextResponse.json(
      { message: error.message, data: null, error: error },
      { status: 500 },
    );
  }
  if (!data.length) {
    return NextResponse.json(
      { message: "News not found", data: null, error: null },
      { status: 400 },
    );
  }

  const news: Array<NewsType> = data;

  return NextResponse.json({
    message: "Get News",
    data: news,
    error: null,
  });
};
