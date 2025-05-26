import { useQuery } from "@tanstack/react-query";
import { getRevenueYear } from "../services/revenue.service";
import styles from "../styles/revenueChart.module.scss";
import Loading from "./Loading";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const RevenueChartByYear = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2020;
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
  const [month, setMonth] = useState<string>(
    Number(new Date().toISOString().split("T")[0].split("-")[0]).toString()
  );

  const { data: revenueData, isLoading: isRevenueLoading } = useQuery({
    queryKey: ["stats", month],
    queryFn: () => getRevenueYear(month),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isRevenueLoading) return <Loading />;

  const labels = revenueData?.map((item) => `T-${item.month_part}`) || [];
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
          text: "Năm",
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
          <select
            className={styles["options"]}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {years.map((m) => (
              <option key={`t-${m}`} value={m}>{`Năm ${m}`}</option>
            ))}
          </select>
        </div>
      </div>
      <Bar data={data} options={{ ...options, maintainAspectRatio: false }} />
    </div>
  );
};

export default RevenueChartByYear;
