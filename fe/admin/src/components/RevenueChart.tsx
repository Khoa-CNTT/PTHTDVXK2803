import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { useRevenueData } from "../hooks/useDashboardData";
import styles from "../styles/revenueChart.module.scss";

interface Props {
  period: string;
}

const RevenueChart = ({ period }: Props) => {
  const { data } = useRevenueData(period);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!data || !data.chartData || data.chartData.length === 0) return;

    // Destroy chart trước khi tạo mới nếu đã tồn tại
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Tạo label tùy theo period
    const labels = data.chartData.map((d) => {
      if (period === "today") {
        // d.date dạng "HH:00"
        return d.date;
      }
      // Các trường hợp khác format ngày tháng
      return new Date(d.date).toLocaleDateString("vi-VN");
    });

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Doanh thu (VND)",
            data: data.chartData.map((d) => d.revenue),
            borderColor: "#6366f1",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const revenue = context.parsed.y.toLocaleString("vi-VN");
                const idx = context.dataIndex;
                const orders = data.chartData[idx]?.orders ?? 0;
                return `Doanh thu: ${revenue} VND, Đơn hàng: ${orders}`;
              },
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => `${Number(value).toLocaleString("vi-VN")} VND`,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Cleanup khi component unmount hoặc data thay đổi
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data, period]);

  return (
    <div className={styles["chart-container"]}>
      <div className={styles["chart-header"]}>
        <h3>Doanh thu theo thời gian</h3>
        <div className={styles["chart-subtitle"]}>Biểu đồ miền với animation</div>
      </div>
      <div
        className={styles["chart-wrapper"]}
        style={{ position: "relative", height: "300px", width: "100%" }}
      >
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default RevenueChart;
