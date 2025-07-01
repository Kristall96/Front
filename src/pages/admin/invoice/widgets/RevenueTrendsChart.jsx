import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  PointElement,
  LineElement,
  LineController,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import zoomPlugin from "chartjs-plugin-zoom";
import { COLORS, formatCurrency, getLastNMonths } from "./utils";

// Register ChartJS plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  PointElement,
  LineElement,
  LineController,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels,
  zoomPlugin
);

export default function RevenueTrendsChart({ data }) {
  const months = getLastNMonths(12);

  // PATCH: Use _id.date as the month (as per your backend)
  const normalized = Array.isArray(data)
    ? data.map((d) => ({
        month: d._id?.date || "", // <--- KEY LINE
        incomes: d.incomes ?? 0,
        outcomes: d.outcomes ?? 0,
      }))
    : [];

  // Guarantee 12 months, zero-filled, in correct order
  const patched = months.map((month) => {
    const found = normalized.find((d) => d.month === month);
    return {
      month,
      incomes: found?.incomes ?? 0,
      outcomes: -(found?.outcomes ?? 0), // NEGATIVE for downward bar
      net: (found?.incomes ?? 0) - (found?.outcomes ?? 0),
    };
  });

  const hasData = patched.some(
    (d) => d.incomes !== 0 || d.outcomes !== 0 || d.net !== 0
  );

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-56 text-gray-400 text-lg">
        <span>No data found.</span>
        <span className="text-xs text-gray-500 mt-2">
          Create invoices to unlock analytics!
        </span>
      </div>
    );
  }

  const incomes = patched.map((d) => d.incomes);
  const outcomes = patched.map((d) => d.outcomes);
  const net = patched.map((d) => d.net);

  const yMin = Math.min(...incomes, ...outcomes, ...net, 0);
  const yMax = Math.max(...incomes, ...outcomes, ...net, 0);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: incomes,
        backgroundColor: incomes.map((v) =>
          v > 0 ? COLORS.income : COLORS.incomeStub
        ),
        borderRadius: 16,
        barPercentage: 0.44,
        categoryPercentage: 0.54,
        order: 2,
        datalabels: {
          anchor: "end",
          align: "start",
          clamp: true,
          display: incomes.map((v) => v > 0),
          color: "#38bdf8",
          font: { weight: "bold", size: 15 },
          backgroundColor: "#101223",
          borderRadius: 7,
          borderWidth: 2,
          borderColor: "#23263a",
          padding: { left: 9, right: 9, top: 3, bottom: 3 },
          formatter: (val) => (val > 0 ? formatCurrency(val) : ""),
        },
      },
      {
        label: "Outcome",
        data: outcomes,
        backgroundColor: outcomes.map((v) =>
          v < 0 ? COLORS.outcome : COLORS.outcomeStub
        ),
        borderRadius: 16,
        barPercentage: 0.44,
        categoryPercentage: 0.54,
        order: 3,
        datalabels: {
          anchor: "end",
          align: "end",
          clamp: true,
          display: outcomes.map((v) => v < 0),
          color: "#ef4444",
          font: { weight: "bold", size: 15 },
          backgroundColor: "#101223",
          borderRadius: 7,
          borderWidth: 2,
          borderColor: "#23263a",
          padding: { left: 9, right: 9, top: 3, bottom: 3 },
          formatter: (val) => (val < 0 ? formatCurrency(Math.abs(val)) : ""),
        },
      },
      {
        label: "Net Result",
        type: "line",
        data: net,
        borderColor: COLORS.net,
        backgroundColor: COLORS.netFill,
        borderWidth: 3,
        fill: true,
        pointRadius: 7,
        pointHoverRadius: 12,
        pointBackgroundColor: COLORS.net,
        pointBorderWidth: 3,
        tension: 0.38,
        yAxisID: "y",
        order: 1,
        datalabels: {
          anchor: "end",
          align: "top",
          clamp: true,
          display: net.map((v) => v !== 0),
          color: "#22c55e",
          font: { weight: "bold", size: 17 },
          backgroundColor: "#101223",
          borderRadius: 9,
          borderWidth: 2,
          borderColor: "#23263a",
          padding: { left: 12, right: 12, top: 6, bottom: 6 },
          formatter: (val) => (val !== 0 ? formatCurrency(val) : ""),
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          title: (ctx) => "📅 " + ctx[0].label,
          label: (ctx) => {
            if (ctx.dataset.label === "Income")
              return `🟦 Income: ${formatCurrency(ctx.raw)}`;
            if (ctx.dataset.label === "Outcome")
              return `🟥 Outcome: ${formatCurrency(Math.abs(ctx.raw))}`;
            if (ctx.dataset.label === "Net Result")
              return `🟢 Net: ${formatCurrency(ctx.raw)}`;
            return ctx.dataset.label + ": " + ctx.raw;
          },
        },
      },
      datalabels: { display: "auto" },
      zoom: {
        pan: { enabled: true, mode: "y" },
        zoom: { wheel: { enabled: true }, mode: "y", drag: { enabled: true } },
      },
    },
    layout: {
      padding: { left: 16, right: 16, top: 18, bottom: 24 },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "#282b41" },
        ticks: {
          color: "#b7bacf",
          font: { size: 15, weight: "bold" },
          callback: (val) => formatCurrency(val),
        },
        beginAtZero: false,
        min: yMin - Math.abs(yMax - yMin) * 0.07,
        max: yMax + Math.abs(yMax - yMin) * 0.13,
      },
    },
  };

  return (
    <div className="w-full h-[500px] md:h-[420px]">
      <Bar data={chartData} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
}
