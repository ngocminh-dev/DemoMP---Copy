import styles from './record.module.css';
function RecordReceive() {
  return (
    <>
      <h2>Chỉnh sửa trạng thái đơn hàng</h2>
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
export default RecordReceive;
