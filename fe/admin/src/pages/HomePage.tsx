import styles from "../styles/homePage.module.scss";
import { Bar } from 'react-chartjs-2'
import Chart from 'chart.js/auto';
import {CategoryScale} from 'chart.js'; 
Chart.register(CategoryScale);

const HomePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>* Quy định sử dụng trang web</h2>
        <div className={styles.data}>
          <Bar
                        data={{
                            labels:['Tháng 1', 'Tháng 2', 'Tháng 3','Tháng 3','Tháng 3','Tháng 3','Tháng 3','Tháng 3','Tháng 3','Tháng 3','Tháng 3','Tháng 3','Tháng 1', 'Tháng 2', 'Tháng 3','Tháng 3','Tháng 3','Tháng 3','Tháng 3','Tháng 3','Tháng 3','Tháng 3','Tháng 3','Tháng 3','Tháng 1', 'Tháng 2', 'Tháng 3','Tháng 3','Tháng 3','Tháng 3','Tháng 3'],
                            datasets:[{
                                label: 'Doanh thu',
                                data: [100, 200, 300, 100, 200, 300, 100, 200, 300,100, 200, 300, 100, 200, 300, 100, 200, 300, 100, 200, 300,100, 200, 300,100, 200, 300, 100, 200, 300, 100],
                                backgroundColor: 'red',
                                barThickness: 30
                            }],
                        }}
                        options={{
                            scales: {
                              y: {
                                title: {
                                  display: true,
                                  text: 'Label cho trục Y'
                                }
                              },
                              x: {
                                title: {
                                  display: true,
                                  text: 'Label cho trục X'
                                }
                              }
                            }
                        }}
                    >
                    </Bar>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
