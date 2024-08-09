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
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </body>
  );
};

export default MainLayout;
