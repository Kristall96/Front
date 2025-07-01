import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { formatCurrency } from "./utils";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#38bdf8",
  "#fde68a",
  "#22c55e",
  "#ef4444",
  "#a78bfa",
  "#f472b6",
  "#818cf8",
  "#f59e42",
  "#16a34a",
  "#dc2626",
  "#eab308",
  "#1e293b",
  "#6366f1",
  "#fbbf24",
];

export default function CurrencyBreakdownPie({ data }) {
  if (!Array.isArray(data)) {
    return (
      <div className="w-full h-[320px] flex items-center justify-center text-red-500">
        No data available or error loading data.
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <div className="w-full h-[320px] flex items-center justify-center text-gray-500">
        No currency breakdown data found.
      </div>
    );
  }

  const labels = data.map((d) => d._id);
  const totals = data.map((d) => d.total);

  // Expand color palette if needed
  const chartColors =
    COLORS.length >= labels.length
      ? COLORS
      : [...COLORS, ...Array(labels.length - COLORS.length).fill("#cbd5e1")];

  return (
    <div className="w-full h-[320px] flex flex-col items-center">
      <Pie
        data={{
          labels,
          datasets: [
            {
              data: totals,
              backgroundColor: chartColors,
              borderColor: "#23263a",
              borderWidth: 2,
            },
          ],
        }}
        options={{
          plugins: {
            legend: { display: true, position: "bottom" },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  `${ctx.label}: ${formatCurrency(ctx.raw, ctx.label)}`,
              },
            },
          },
        }}
      />
    </div>
  );
}
