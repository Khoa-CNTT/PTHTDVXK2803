import styles from "../styles/historyBookTicket.module.scss";

const HistoryBookTicket = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}> 
        <h2>Lịch sử đặt vé</h2>
        <div className={styles.data}>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Họ và tên</th>
                        <th>Số Vé</th>
                        <th>Thời gian</th>
                        <th>Điểm đi - Điểm đến</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Email</td>
                        <td>ọ và tên</td>
                        <td>Số Vé</td>
                        <td>Số Vé</td>
                        <td>Số Vé</td>
                        <td>Số Vé</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryBookTicket;
