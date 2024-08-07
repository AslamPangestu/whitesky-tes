import { Metadata } from "next";

import styles from "./index.module.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Homepage",
  description: "Homepage seo description for news",
};

const DUMMIES = [
  {
    id: 1,
    title: "Title",
    author: "Author",
    description: "Description",
    created_at: new Date(),
  },
  {
    id: 2,
    title: "Title",
    author: "Author",
    description: "Description",
    created_at: new Date(),
  },
  {
    id: 3,
    title: "Title",
    author: "Author",
    description: "Description",
    created_at: new Date(),
  },
];

const HomePage = () => {
  return (
    <>
      <section>
        <h1>News Homepage</h1>
      </section>
      <section className={styles.newsContainer}>
        {DUMMIES.map((item) => (
          <Link key={item.id} href={`/${item.id}`}>
            <article>
              <div>Image</div>
              <div>
                <h2>{item.title}</h2>
                <span>{item.author}</span>
                <span>{item.created_at.toISOString()}</span>
                <p>{item.description}</p>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </>
  );
};

export default HomePage;
