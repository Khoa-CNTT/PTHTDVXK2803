import styles from "../styles/loading.module.scss";
const Loading = () => {
  return (
    <div className={styles.animation}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loading;
