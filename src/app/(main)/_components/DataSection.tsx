import { useMemo, useState } from "react";
import Link from "next/link";

import type { NewsType } from "src/models/NewsModel";

import styles from "../index.module.css";

interface Props {
  baseData: Array<NewsType>;
}

const DataItem = (props: NewsType) => (
  <article>
    <div>Image</div>
    <div>
      <h2>{props.title}</h2>
      <span>{props.author}</span>
      <span>{props.created_at}</span>
      <p>{props.description}</p>
    </div>
  </article>
);

// TODO: Infinite Scrolling
const DataSection = ({ baseData }: Props) => {
  const [data, setData] = useState<Array<NewsType>>([]);

  const realData = useMemo(() => {
    if (!data.length) {
      return baseData;
    }
    return [...baseData, ...data];
  }, [data, baseData]);

  return (
    <section className={styles.newsContainer}>
      {realData.map((item: NewsType) => (
        <Link key={item.id} href={`/${item.id}`}>
          <DataItem {...item} />
        </Link>
      ))}
    </section>
  );
};

export default DataSection;
