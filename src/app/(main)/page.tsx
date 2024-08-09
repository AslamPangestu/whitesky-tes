import { Metadata } from "next";
import dynamic from "next/dynamic";

import DBConnection from "src/libs/db";
import NewsRepository from "src/repositories/NewsRepository";

import type { NewsType } from "src/models/NewsModel";
import type { DBResponse } from "src/libs/db";

const DataSection = dynamic(() => import("./_components/DataSection"));

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Homepage",
  description: "Homepage seo description for news",
};

interface GetDataResponse {
  haveMore: boolean;
  data: Array<NewsType>;
}

const getData = async (): Promise<GetDataResponse> => {
  const { db, error: errorDB }: DBResponse = await DBConnection();
  if (!db) {
    throw new Error(errorDB);
  }

  const repo: NewsRepository = new NewsRepository(db);
  const { data, error } = await repo.find({ page: 1, limit: 20 });
  if (error) {
    db.release();
    throw new Error(error);
  }

  let haveMore = false;
  if (data.length) {
    const { data, error: totalError } = await repo.checkHaveMoreData(1, 20);
    if (totalError) {
      db.release();
      throw new Error(totalError);
    }
    haveMore = !!data[0];
  }

  db.release();
  return { haveMore, data };
};

const HomePage = async () => {
  const { data, haveMore }: GetDataResponse = await getData();

  return (
    <>
      <section>
        <h1>News Homepage</h1>
      </section>
      <DataSection baseData={data} baseHaveMore={haveMore} />
    </>
  );
};

export default HomePage;
