import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { formatCurrency } from "./utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function TopClientsBar({ data, yMax = undefined }) {
  // Defensive: handle loading or bad data
  if (!Array.isArray(data)) {
    return (
      <div className="w-full h-[340px] flex items-center justify-center text-red-500">
        No data available or error loading data.
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <div className="w-full h-[340px] flex items-center justify-center text-gray-500">
        No client revenue data found.
      </div>
    );
  }

  // Prepare chart data
  const labels = data.map((d) => d.company?.name || "Unknown");
  const totals = data.map((d) => d.total);

  return (
    <div className="w-full h-[340px]">
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Total Revenue",
              data: totals,
              backgroundColor: "#22c55edd",
              borderRadius: 12,
            },
          ],
        }}
        options={{
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.raw)}`,
              },
            },
            datalabels: {
              display: true,
              color: "#fff",
              align: "end",
              anchor: "end",
              font: { weight: "bold" },
              formatter: (value) => formatCurrency(value),
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ...(yMax ? { max: yMax } : {}),
            },
            x: { grid: { display: false } },
          },
        }}
      />
    </div>
  );
}
