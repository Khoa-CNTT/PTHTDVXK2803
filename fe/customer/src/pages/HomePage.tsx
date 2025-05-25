import logo1 from "../assets/images/logo1.svg";
import Connection from "../components/Connection";
import PopularRoutesSlider from "../components/PopularRoutesSlider";
import PromotionSlider from "../components/PromotionSlider";
import Quality from "../components/Quality";
import SearchTrip from "../components/SearchTrip";
import styles from "../styles/homePage.module.scss";

const HomePage = () => {
  return (
    <div className={styles["homepage-container"]}>
      <div className={styles["banner-wrapper"]}>
        <img
          className={styles["img-banner"]}
          src={logo1}
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
      <div className={styles.quality}>
          <Quality />
      </div>
      <div className={styles.connection}>
          <Connection />
      </div>
    </div>
  );
};

export default HomePage;
