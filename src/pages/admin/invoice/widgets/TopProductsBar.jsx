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

// Register all plugins (do this only ONCE per app session)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function TopProductsBar({ data }) {
  // Defensive: Show loading/error if not array
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
        No product sales data found.
      </div>
    );
  }

  const labels = data.map((d) => d._id);
  const totals = data.map((d) => d.total);

  return (
    <div className="w-full h-[340px]">
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Total Sold",
              data: totals,
              backgroundColor: "#38bdf8dd",
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
              max: 20000, // <-- set Y axis max here!
            },
            x: { grid: { display: false } },
          },
        }}
      />
    </div>
  );
}
