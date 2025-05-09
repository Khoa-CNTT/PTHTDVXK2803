import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import styles from "../styles/layout.module.scss";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles["wrapper-layout"]}>
      <div className={styles["main-layout"]}>
        <main className={`${styles.main} ${styles.center}`}>
          <Sidebar />
          <div className={styles["wrapper-header-main"]}>
            <header className={styles.header}>
              <Header />
            </header>
            {children}
          </div>
        </main>
        <footer className={`${styles.footer} ${styles.center}`}>
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default Layout;
