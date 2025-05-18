import { useLocation } from "react-router";
import styles from "../styles/detailPromotion.module.scss";

const DetailPromotion = () => {
    const location = useLocation();
    const { promotion } = location.state || {};


  return (
    <div className={styles.container}>
        <div className={styles.content}>
            <h2>{promotion?.title}</h2>
            <span className={styles.description}>{promotion?.description}</span>
            <img
                className={styles["img-banner"]}
                src={promotion?.img}
                alt="banner-wrapper"
            />
            <div className={styles.information}>
                <ul>
                    {promotion?.information.map((item: string, index: number) => (
                        <li>{item}</li>
                    ))}
                </ul>
            </div>
            <div className={styles.condition}>
                <ul>
                    {promotion?.condition.map((item: string, index: number) => (
                        <li>{item}</li>
                    ))}
                </ul>
            </div>
             <div className={styles.reason}>
                <ul>
                    {promotion?.reason.map((item: string, index: number) => (
                        <li>{item}</li>
                    ))}
                </ul>
            </div>
            <div className={styles.instruct}>
                <ul>
                    {promotion?.instruct.map((item: string, index: number) => (
                        <li>{item}</li>
                    ))}
                </ul>
            </div>
            <div className={styles.contact}>
                <ul>
                    {promotion?.contact.map((item: string, index: number) => (
                        <li>{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
};

export default DetailPromotion;
