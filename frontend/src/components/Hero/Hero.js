import styles from './Hero.module.css';

const Hero = () => {
  return (
    <div className={`${styles.heroWrapper} center`}>
      <div className={`${styles.heroInner}`}>
        <h2 className={styles.headerText}>Tra cứu đơn hàng của bạn</h2>
        <div className={styles.slogan}>
          <p>Tra cứu đơn hàng chỉ với 1 chạm!</p>
        </div>
        <div className={styles.inputLocation}>
          <i class="fa-solid fa-boxes-packing"></i>
          <input
            type="text"
            placeholder="Nhập mã đơn hàng tại đây"
            className={styles.orderInput}
          />
          <i className={`${styles.arrow} fas fa-arrow-right`}></i>
        </div>
      </div>
      <div className={styles.heroImage}>
        <img
          src="https://d2d8wwwkmhfcva.cloudfront.net/x856/d2guulkeunn7d8.cloudfront.net/assets/homepage/homepage_background_full_m3_cropped-8d2d286263821da7decd7c61fb1db1eb0e3dec13e0c356277d6d3cb7484c024a.jpg"
          alt=""
        />
      </div>
    </div>
  );
};
export default Hero;
