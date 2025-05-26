import { useQuery } from "@tanstack/react-query";
import { getRevenueHour } from "../services/revenue.service";
import Loading from "./Loading";
import styles from "../styles/revenueChart.module.scss";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const periodLabels: Record<string, string> = {
  today: "Hôm nay",
  yesterday: "Hôm qua",
};

const periods = Object.keys(periodLabels);

const RevenueChartByHours = () => {
  const [period, setPeriod] = useState("today");

  const { data: revenueData, isLoading: isRevenueLoading } = useQuery({
    queryKey: ["stats", period],
    queryFn: () => getRevenueHour(period),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isRevenueLoading) return <Loading />;

  const labels = revenueData?.map((item) => `${item.hour_part}`) || [];
  const data = {
    labels,
    datasets: [
      {
        label: "Doanh thu",
        data: revenueData?.map((item) => item.total_revenue) || [],
        backgroundColor: "#2eb4fc",

        borderRadius: 4,
        barPercentage: 0.6,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"bar">) => {
            const value = ctx.parsed.y;
            return `${ctx.dataset.label}: ${value.toLocaleString()} VND`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Giờ",
        },
        categoryPercentage: 0.6,
        barPercentage: 0.8,
      },
      y: {
        title: {
          display: true,
          text: "Doanh thu",
        },
        ticks: {
          callback: (value: string | number) =>
            typeof value === "number" ? value.toLocaleString() : value,
        },
      },
    },
  };

  return (
    <div className={styles["renevue-chart-container"]}>
      <div className={styles["filterd-container"]}>
        <div className={styles["filters"]}>
          {periods.map((p) => (
            <button
              key={p}
              className={`${styles["filter-btn"]} ${
                p === period ? `${styles["filter-btn__active"]}` : ""
              }`}
              onClick={() => setPeriod(p)}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>
      <Bar data={data} options={{ ...options, maintainAspectRatio: false }} />
    </div>
  );
};

export default RevenueChartByHours;
