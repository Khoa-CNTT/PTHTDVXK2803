import { useState } from "react";
import Stats from "../components/Stats";
import RevenueChart from "../components/RevenueChart";

const periodLabels: Record<string, string> = {
  today: "Hôm nay",
  this_week: "Tuần này",
  this_month: "Tháng này",
  last_month: "Tháng trước",
  this_year: "Năm này",
  last_year: "Năm trước",
  all: "Tất cả",
};

const periods = Object.keys(periodLabels);

const Dashboard = () => {
  const [period, setPeriod] = useState("today");

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Dashboard Đặt Vé</h1>
        <p>Theo dõi doanh thu và đơn hàng theo thời gian</p>
      </div>

      <div className="filters">
        {periods.map((p) => (
          <button
            key={p}
            className={`filter-btn ${p === period ? "filter-btn--active" : ""}`}
            onClick={() => setPeriod(p)}
          >
            {periodLabels[p]}
          </button>
        ))}
      </div>

      <Stats period={period} />
      <RevenueChart period={period} />
      {/* <Transactions /> */}
    </div>
  );
};

export default Dashboard;
