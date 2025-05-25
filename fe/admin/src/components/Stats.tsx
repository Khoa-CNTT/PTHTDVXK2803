import { useRevenueData } from "../hooks/useDashboardData";

interface Props {
  period: string;
}

const Stats = ({ period }: Props) => {
  const { data, isLoading, isError } = useRevenueData(period);

  if (isLoading) {
    return <div className="stats">Đang tải...</div>;
  }

  if (isError || !data) {
    return <div className="stats">Lỗi tải dữ liệu</div>;
  }

  return (
    <div className="stats">
      <div className="stat-card stat-card--primary">
        <div className="stat-card__header">
          <h3>Tổng doanh thu</h3>
          <div>{period}</div>
        </div>
        <div className="stat-card__value">
          {data.summary.total_revenue.toLocaleString("vi-VN")} VND
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-card__header">
          <h3>Tổng đơn hàng</h3>
          <div>📊</div>
        </div>
        <div className="stat-card__value">{data.summary.total_orders} đơn hàng</div>
      </div>
    </div>
  );
};

export default Stats;
