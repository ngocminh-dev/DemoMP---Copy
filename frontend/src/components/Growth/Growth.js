import styles from './Growth.module.css';
import { growth } from '../../constants/growth';
import GrowthBox from './GrowthBox';

const imgURL1 =
  'https://d2guulkeunn7d8.cloudfront.net/assets/homepage/homepage_stats-538f51946acc9e8a72b982654287ee0ad8d7a848df2cd860935bbc3c2a97e84a.jpg';
const imgURL2 =
  'https://d2guulkeunn7d8.cloudfront.net/assets/homepage/homepage_stats_mobile-24bd627084eed46859cb6cf670de84feb1de9ef24909f36cb85db410e57313e8.jpg';

const Growth = () => {
  return (
    <div id="about" className={`${styles.growthWrapper} center`}>
      <div className={`${styles.growthWrapperInner} center`}>
        <div className={styles.growthHeading}>
          <p>Dịch vụ chuyển phát hàng đầu cả nước</p>
        </div>
        <div className={styles.growthImg}>
          <img className={styles.img1} src={imgURL1} alt="" />
          <img className={styles.img2} src={imgURL2} alt="" />
        </div>
        <div className={`${styles.growthList} center`}>
          {growth.map(({ field, description }) => {
            return <GrowthBox field={field} description={description} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Growth;
