import Link from "next/link";
import styles from "./index.module.css";

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <body>
      <header className={styles.headerContainer}>
        <Link href="/">
          <span>News</span>
        </Link>
        <Link href="/login">
          <span>Login</span>
        </Link>
      </header>
      <main className={styles.mainContainer}>{children}</main>
      <footer>Footer</footer>
    </body>
  );
};

export default MainLayout;
