import { Metadata } from "next";

import DBConnection from "src/libs/db";
import NewsRepository from "src/repositories/NewsRepository";

import type { DBResponse } from "src/libs/db";
import type { NewsType } from "src/models/NewsModel";

interface Props {
  params: { slug: string };
}

const getData = async (slug: string): Promise<NewsType> => {
  const { db, error: errorDB }: DBResponse = await DBConnection();
  if (!db) {
    throw new Error(errorDB);
  }

  const repo: NewsRepository = new NewsRepository(db);
  const { data, error } = await repo.findBySlug(slug);
  if (error) {
    db.release();
    throw new Error(error);
  }

  db.release();
  return data;
};

export const generateStaticParams = async () => {
  const { db, error: errorDB }: DBResponse = await DBConnection();
  if (!db) {
    throw new Error(errorDB);
  }

  const repo: NewsRepository = new NewsRepository(db);
  const { data, error } = await repo.find({
    page: 0,
    limit: 0,
    fields: ["slug"],
  });
  if (error) {
    db.release();
    throw new Error(error);
  }

  db.release();
  return data;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const data: NewsType = await getData(params.slug);

  return {
    title: data.title,
    description: data.description,
  };
};

const DetailPage = async ({ params }: { params: { slug: string } }) => {
  const data: NewsType = await getData(params.slug);

  return (
    <section>
      <h1>{data.title}</h1>
      <div>
        <span>{data.created_at}</span>
        <span>{data.author}</span>
      </div>
      <div>image</div>
      <p>{data.body}</p>
    </section>
  );
};

export default DetailPage;
