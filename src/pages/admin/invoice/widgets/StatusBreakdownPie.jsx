import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { formatCurrency } from "./utils"; // <-- Make sure this is available in your project

ChartJS.register(ArcElement, Tooltip, Legend);

// Map status values to colors and labels
const STATUS_COLORS_MAP = {
  paid: "#14b8a6",
  unpaid: "#ef4444",
  draft: "#facc15",
};

const STATUS_LABELS_MAP = {
  paid: "Paid",
  unpaid: "Unpaid",
  draft: "Draft",
};

function getStatusLabel(status) {
  if (!status) return "Unknown";
  if (STATUS_LABELS_MAP[status]) return STATUS_LABELS_MAP[status];
  return String(status).charAt(0).toUpperCase() + String(status).slice(1);
}

/**
 * @param {Array} data - [{ status, count, total }]
 */
export default function StatusBreakdownPie({ data }) {
  const [showTotal, setShowTotal] = useState(false);

  // Defensive: if backend sends null/undefined/empty, show message
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center mt-8">
        <p className="text-gray-400">No invoice data found for this period.</p>
      </div>
    );
  }

  // Prepare data for the chart
  const totalValue = data.reduce(
    (sum, d) => sum + (showTotal ? d.total ?? 0 : d.count ?? 0),
    0
  );
  const labels = data.map((d) => getStatusLabel(d.status));
  const values = data.map((d) => (showTotal ? d.total ?? 0 : d.count ?? 0));
  const bgColors = data.map((d) => STATUS_COLORS_MAP[d.status] || "#6b7280");

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Toggle buttons (optional) */}
      <div className="mb-3 flex justify-center">
        <button
          onClick={() => setShowTotal(false)}
          className={`px-4 py-1 rounded-l transition font-medium
            ${
              !showTotal
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-800 text-gray-300"
            }`}
        >
          Count
        </button>
        <button
          onClick={() => setShowTotal(true)}
          className={`px-4 py-1 rounded-r transition font-medium
            ${
              showTotal
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-800 text-gray-300"
            }`}
        >
          Total
        </button>
      </div>
      <div
        className="flex flex-col md:flex-row items-center justify-center gap-10 rounded-2xl shadow-2xl p-6 md:p-10"
        style={{
          background: "#1a1c29",
          width: 680,
          minWidth: 680,
          maxWidth: 680,
          height: 340,
          minHeight: 340,
          maxHeight: 340,
          boxSizing: "border-box",
        }}
      >
        {/* Pie Chart */}
        <div style={{ width: 320, height: 220, minWidth: 310 }}>
          <Pie
            data={{
              labels,
              datasets: [
                {
                  data: values,
                  backgroundColor: bgColors,
                  borderColor: "#23263a",
                  borderWidth: 4,
                  hoverOffset: 10,
                  cutout: "40%",
                },
              ],
            }}
            options={{
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (ctx) =>
                      `${ctx.label}: ${
                        showTotal ? formatCurrency(ctx.parsed) : ctx.parsed
                      } (${
                        totalValue
                          ? Math.round((ctx.parsed / totalValue) * 100)
                          : 0
                      }%)`,
                  },
                },
              },
              layout: { padding: 4 },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
        {/* Custom Legend */}
        <div
          className="flex flex-col justify-center gap-4"
          style={{
            width: 220,
            minWidth: 220,
            maxWidth: 220,
          }}
        >
          {data.map((d, idx) => {
            const label = getStatusLabel(d.status);
            const color = STATUS_COLORS_MAP[d.status] || "#6b7280";
            const value = showTotal ? d.total ?? 0 : d.count ?? 0;
            const percent = totalValue
              ? Math.round((value / totalValue) * 100)
              : 0;
            return (
              <div key={d.status || idx} className="flex items-center gap-3">
                <span
                  className="inline-block rounded-full"
                  style={{
                    width: 18,
                    height: 18,
                    background: color,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}
                />
                <span className="text-gray-100 font-semibold min-w-[60px]">
                  {label}
                </span>
                <span
                  className="text-gray-200 font-mono text-base text-right"
                  style={{
                    width: 90,
                    display: "inline-block",
                  }}
                >
                  {showTotal ? formatCurrency(value) : value}
                </span>
                <span className="text-gray-400 text-sm ml-1">{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
