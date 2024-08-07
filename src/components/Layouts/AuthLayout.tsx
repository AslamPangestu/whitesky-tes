import styles from "./index.module.css";

interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <body>
      <main className={styles.mainContainer}>{children}</main>
    </body>
  );
};

export default AuthLayout;
