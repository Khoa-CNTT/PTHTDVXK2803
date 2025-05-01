import Footer from "../components/Footer";
import Header from "../components/Header";
// import Sidebar from "../components/SideBar";
import styles from "../styles/layout.module.scss";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles["wrapper-layout"]}>
      {/* Sidebar ngoài cùng */}
      {/* <Sidebar />  */}
      {/* Nội dung chính */}
      <div className={styles["main-layout"]}>
        <header className={styles.header}>
          <Header />
        </header>
        <main className={`${styles.main} ${styles.center}`}>{children}</main>
        <footer className={`${styles.footer} ${styles.center}`}>
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default Layout;
