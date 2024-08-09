import { Metadata } from "next";
import Image from "next/image";
import dayjs from "dayjs";

import DBConnection from "src/libs/db";
import NewsRepository from "src/repositories/NewsRepository";

import type { DBResponse } from "src/libs/db";
import type { NewsType } from "src/models/NewsModel";

import styles from "./index.module.css";
import Link from "next/link";

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
  return data[0];
};

export const revalidate = 3600;

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
    <section className={styles.detailNewsContainer}>
      <div>
        <span>
          <Link href="/">Home</Link> / {data.title}
        </span>
      </div>
      <h1>{data.title}</h1>
      <div>
        <span>{data.author}</span>
        <span>, {dayjs(data.created_at).format("DD MMMM YYYY HH:mm")}</span>
      </div>
      <div>
        <Image
          src={data.image}
          alt={`Img ${data.title}`}
          objectFit="cover"
          fill
        />
      </div>
      <div dangerouslySetInnerHTML={{ __html: data.body }} />
    </section>
  );
};

export default DetailPage;
