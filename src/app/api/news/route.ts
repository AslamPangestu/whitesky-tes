import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import DBConnection from "src/libs/db";
import NewsRepository from "src/repositories/NewsRepository";

import type { DBResponse } from "src/libs/db";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const pageQuery = searchParams.get("page");

  const { db, error: dbError }: DBResponse = await DBConnection();
  if (!db) {
    return NextResponse.json(
      { message: dbError.message, data: null, error: dbError },
      { status: 500 },
    );
  }

  const page = pageQuery ? parseInt(pageQuery) : 1;
  const repo: NewsRepository = new NewsRepository(db);
  const { data, error } = await repo.find({
    page,
    limit: 20,
  });
  if (error) {
    db.release();
    return NextResponse.json(
      { message: error.message, data: null, error: error },
      { status: 500 },
    );
  }

  let haveMore = false;
  if (data.length) {
    const { data, error: totalError } = await repo.checkHaveMoreData(page, 20);
    if (totalError) {
      db.release();
      return NextResponse.json(
        { message: totalError.message, data: null, error: totalError },
        { status: 500 },
      );
    }
    haveMore = !!data[0];
  }

  db.release();
  return NextResponse.json({
    message: "Get News",
    data: {
      current_page: page,
      data,
      have_more: haveMore,
    },
    error: null,
  });
};
