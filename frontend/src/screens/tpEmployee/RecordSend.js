import styles from './record.module.css';

function RecordSend() {
  return (
    <>
      <h2>Tạo hóa đơn cho người gửi</h2>
      <div className={styles.inputLocation}>
        <i class="fa-solid fa-boxes-packing"></i>
        <input
          type="text"
          placeholder="Nhập mã đơn hàng tại đây"
          className={styles.orderInput}
        />
        <i className={`${styles.arrow} fas fa-arrow-right`}></i>
      </div>
    </>
  );
}
export default RecordSend;
