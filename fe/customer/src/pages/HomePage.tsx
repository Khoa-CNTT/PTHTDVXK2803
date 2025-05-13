import SearchTrip from "../components/SearchTrip";
import styles from "../styles/homePage.module.scss";

const HomePage = () => {
  return (
    <div className={styles["homepage-container"]}>
      <div className={styles["banner-wrapper"]}>
        <img
          className={styles["img-banner"]}
          src="https://static.vexere.com/production/banners/1209/leaderboard_1440x480.jpg"
          alt="banner-wrapper"
        />
        <div className={styles["content-wrapper"]}>
          <SearchTrip />
        </div>
      </div>
      <div className={styles["search-trip-mobile"]}>
        <SearchTrip />
      </div>
    </div>
  );
};

export default HomePage;
