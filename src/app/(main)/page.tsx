import { Metadata } from "next";
import dynamic from "next/dynamic";

import DBConnection from "src/libs/db";
import NewsRepository from "src/repositories/NewsRepository";

import type { NewsType } from "src/models/NewsModel";
import type { DBResponse } from "src/libs/db";

const DataSection = dynamic(() => import("./_components/DataSection"));

export const metadata: Metadata = {
  title: "Homepage",
  description: "Homepage seo description for news",
};

const getData = async (): Promise<Array<NewsType>> => {
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

  db.release();
  return data;
};

const HomePage = async () => {
  const data: Array<NewsType> = await getData();

  return (
    <>
      <section>
        <h1>News Homepage</h1>
      </section>
      <DataSection baseData={data} />
    </>
  );
};

export default HomePage;
