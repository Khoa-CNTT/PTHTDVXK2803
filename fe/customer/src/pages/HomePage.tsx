import SearchTrip from "../components/SearchTrip";
import styles from "../styles/homePage.module.scss";
import logo5 from "../assets/images/logo5.jpg";
import PromotionSlider from "../components/PromotionSlider";
import PopularRoutesSlider from "../components/PopularRoutesSlider";
import Connection from "../components/Connection";

const HomePage = () => {
  return (
    <div className={styles["homepage-container"]}>
      <div className={styles["banner-wrapper"]}>
        <img
          className={styles["img-banner"]}
          src={logo5}
          alt="banner-wrapper"
        />
        
      </div>
      <div className={styles["content-wrapper"]}>
          <SearchTrip />
        </div>
      <div>
          <PromotionSlider />
      </div>
      <div>
          <PopularRoutesSlider />
      </div>
      <div>
          <Connection />
      </div>
      <div className={styles["search-trip-mobile"]}>
        <SearchTrip />
      </div>
    </div>
  );
};

export default HomePage;
