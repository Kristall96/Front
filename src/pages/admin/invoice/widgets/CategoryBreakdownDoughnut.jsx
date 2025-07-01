import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { formatCurrency } from "./utils";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#38bdf8",
  "#fbbf24",
  "#22c55e",
  "#ef4444",
  "#a78bfa",
  "#f472b6",
  "#fde68a",
  "#fb7185",
  "#16a34a",
  "#f59e42",
  "#6366f1",
  "#1e293b",
  "#eab308",
  "#dc2626",
];

export default function CategoryBreakdownDoughnut({ data }) {
  // Defensive: error/empty states
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
        No category breakdown data found.
      </div>
    );
  }

  const labels = data.map((d) => d._id || "Unknown");
  const totals = data.map((d) => d.total);

  // Extend COLORS if needed
  const chartColors =
    COLORS.length >= labels.length
      ? COLORS
      : [...COLORS, ...Array(labels.length - COLORS.length).fill("#cbd5e1")];

  return (
    <div className="w-full h-[320px] flex flex-col items-center">
      <Doughnut
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
                label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.raw)}`,
              },
            },
          },
        }}
      />
    </div>
  );
}
