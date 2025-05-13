import styles from "../styles/loading.module.scss";

const Loading = () => {
  return (
    <div className={styles.dots}>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
    </div>
  );
};

export default Loading;
