import styles from "./index.module.css";

const Loader = () => {
  return (
    <div className={styles.container}>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  );
};
export default Loader;
