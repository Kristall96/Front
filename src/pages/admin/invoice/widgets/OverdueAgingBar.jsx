import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { formatCurrency } from "./utils";
import secureAxios from "../../../../utils/secureAxios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
  ChartDataLabels
);

const BUCKET_LABELS = ["0-30 days", "31-60 days", "61-90 days", "90+ days"];
const BUCKET_KEYS = ["0-30", "31-60", "61-90", "90+"];

export default function OverdueAgingBar() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    secureAxios
      .get("/invoices/analytics?analyticType=overdueAging")
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load overdue aging data.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const buckets = BUCKET_KEYS.map(
    (key) => data?.[key] || { count: 0, total: 0 }
  );
  const totalInvoices = buckets.reduce((sum, b) => sum + b.count, 0);

  if (loading) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center">
        <span className="text-red-400">{error}</span>
      </div>
    );
  }

  // Use these colors for each bucket
  const barColors = [
    "rgba(239, 68, 68, 0.92)", // red
    "rgba(251, 191, 36, 0.92)", // yellow
    "rgba(59, 130, 246, 0.92)", // blue
    "rgba(99, 102, 241, 0.92)", // indigo
  ];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="w-full h-[350px]">
        <Bar
          data={{
            labels: BUCKET_LABELS,
            datasets: [
              {
                label: "Overdue Invoices",
                data: buckets.map((b) => b.count),
                backgroundColor: barColors,
                borderRadius: 18,
                barPercentage: 0.7,
                categoryPercentage: 0.68,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 20, bottom: 0, left: 10, right: 10 } },
            plugins: {
              legend: { display: false },
              datalabels: {
                display: true,
                color: "#fff",
                font: { weight: "bold", size: 22, family: "Inter, sans-serif" },
                anchor: "end",
                align: "end",
                offset: 6,
                formatter: (v) => (v > 0 ? v.toLocaleString() : ""),
                textStrokeColor: "#23263a",
                textStrokeWidth: 4,
                shadowBlur: 6,
                shadowColor: "#23263a88",
                clamp: true,
              },
              tooltip: {
                callbacks: {
                  title: (ctx) => BUCKET_LABELS[ctx[0].dataIndex],
                  label: (ctx) => {
                    const idx = ctx.dataIndex;
                    return [
                      `Count: ${buckets[idx].count}`,
                      `Total: ${formatCurrency(buckets[idx].total)}`,
                    ];
                  },
                },
                backgroundColor: "#23263a",
                borderColor: "#3b3b54",
                borderWidth: 1,
                bodyFont: { size: 15, weight: "bold" },
                titleFont: { size: 15 },
              },
              title: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                min: 0,
                max: 50, // <-- Set max to 50
                ticks: { color: "#bbb", font: { size: 16 } },
                grid: { color: "#23273d" },
              },
              x: {
                ticks: { color: "#eee", font: { size: 16, weight: "bold" } },
                grid: { display: false },
              },
            },
          }}
        />
      </div>
      {/* Totals display */}
      <div className="flex justify-between w-full mt-4 px-2">
        {BUCKET_LABELS.map((label, i) => (
          <div key={label} className="flex flex-col items-center flex-1">
            <span className="text-xs text-gray-400">{label}</span>
            <span className="text-md font-semibold text-gray-100">
              {formatCurrency(buckets[i].total)}
            </span>
          </div>
        ))}
      </div>
      {/* Summary */}
      <div className="mt-2 text-center text-sm text-gray-400">
        {totalInvoices > 0
          ? `${totalInvoices} total overdue invoice${
              totalInvoices > 1 ? "s" : ""
            }`
          : "No overdue invoices!"}
      </div>
    </div>
  );
}
