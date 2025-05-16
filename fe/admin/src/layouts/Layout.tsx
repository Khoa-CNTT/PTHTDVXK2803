import Footer from "../components/Footer";
import Header from "../components/Header";
import styles from "../styles/layout.module.scss";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles["wrapper-layout"]}>
      <header className={styles.header}>
        <Header />
      </header>
      <main className={`${styles.main} ${styles.center}`}>{children}</main>
      <footer className={`${styles.footer} ${styles.center}`}>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
