import Link from "next/link";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";

const AuthButton = dynamic(() => import("./AuthButton"));

import styles from "../index.module.css";

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
        <AuthButton />
      </header>
      <main className={styles.mainContainer}>{children}</main>
      <Toaster />
    </body>
  );
};

export default MainLayout;
