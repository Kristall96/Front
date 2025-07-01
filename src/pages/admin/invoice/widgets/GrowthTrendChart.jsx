import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import zoomPlugin from "chartjs-plugin-zoom";

// Utility functions
function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
function formatPercent(val) {
  if (val === null || isNaN(val)) return "--";
  return `${Number(val).toFixed(2)}%`;
}
function getLastNMonths(n) {
  const arr = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    arr.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return arr;
}

function calculateGrowth(arr, cap = 150) {
  const growth = [];
  for (let i = 0; i < arr.length; i++) {
    if (i === 0) {
      growth.push(0);
      continue;
    }
    const prev = arr[i - 1];
    const curr = arr[i];
    if (prev === 0 && curr === 0) {
      growth.push(0);
    } else if (prev === 0 && curr > 0) {
      growth.push(cap);
    } else if (prev > 0 && curr === 0) {
      growth.push(-100);
    } else {
      const g = ((curr - prev) / Math.abs(prev)) * 100;
      growth.push(Math.max(-cap, Math.min(g, cap)));
    }
  }
  return growth;
}

const COLORS = {
  positive: "#22c55e",
  negative: "#ef4444",
  growth: "#facc15",
  neutral: "#23263a",
  barBorder: "#22c55e", // Thin green line
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels,
  zoomPlugin
);

export default function GrowthTrendsChart({ data = [], currency = "USD" }) {
  const months = getLastNMonths(12);

  // Patch missing months
  const patched = months.map((month) => {
    const found = data.find((d) => d.date === month || d._id?.date === month);

    let net = 0;
    if (found) {
      if (typeof found.total === "number") {
        net = found.total;
      } else if (
        typeof found.income === "number" &&
        typeof found.outcome === "number"
      ) {
        if (found.outcome < 0) {
          net = found.income + found.outcome;
        } else {
          net = found.income - found.outcome;
        }
      } else if (typeof found.outcome === "number") {
        net = -Math.abs(found.outcome);
      }
    }

    return {
      month,
      total: net,
    };
  });

  const hasData = patched.some((d) => d.total !== 0);
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

  const totalBar = patched.map((d) => d.total);
  const growthLine = calculateGrowth(totalBar, 150);

  // Arrows for growth trend
  const arrows = growthLine.map((g, i) =>
    i === 0 || g === null ? "" : g > 0 ? "↑" : g < 0 ? "↓" : "→"
  );

  const barColors = totalBar.map((v) =>
    v > 0 ? COLORS.positive : v < 0 ? COLORS.negative : COLORS.neutral
  );
  const barLabelColors = totalBar.map((v) =>
    v > 0 ? COLORS.positive : v < 0 ? COLORS.negative : "#b7bacf"
  );

  // Find abs min/max for each axis
  const netAbsMax = Math.max(
    Math.abs(Math.min(...totalBar, 0)),
    Math.abs(Math.max(...totalBar, 0))
  );
  const growthNonNull = growthLine.filter((x) => x !== null && !isNaN(x));
  const growthAbsMax = Math.max(
    Math.abs(Math.min(...growthNonNull, 0)),
    Math.abs(Math.max(...growthNonNull, 0)),
    100
  );

  // Add some visual padding
  const netPadding = Math.max(netAbsMax * 0.1, 1000);
  const growthPadding = Math.max(growthAbsMax * 0.1, 10);

  // Use same ratios, always symmetric around 0
  const axis1Max = netAbsMax + netPadding;
  const axis1Min = -axis1Max;
  const axis2Max = growthAbsMax + growthPadding;
  const axis2Min = -axis2Max;

  const chartData = {
    labels: months,
    datasets: [
      // Green bar
      {
        type: "bar",
        label: "Net Result",
        data: totalBar,
        backgroundColor: barColors,
        borderRadius: 16,
        barPercentage: 0.25,
        categoryPercentage: 0.4,
        order: 3,
        borderSkipped: false,
        borderWidth: 0, // no border, line handled by line dataset below
        datalabels: {
          anchor: "end",
          align: "start",
          clamp: true,
          display: totalBar.map((v) => v !== 0),
          color: barLabelColors,
          font: { weight: "bold", size: 15 },
          backgroundColor: "#101223",
          borderRadius: 7,
          borderWidth: 2,
          borderColor: "#23263a",
          padding: { left: 9, right: 9, top: 3, bottom: 3 },
          formatter: (val) =>
            val !== 0
              ? val > 0
                ? formatCurrency(val, currency)
                : `-${formatCurrency(Math.abs(val), currency)}`
              : "",
        },
        yAxisID: "y",
      },
      // Thin green line
      {
        type: "line",
        label: "Net Line",
        data: totalBar,
        borderColor: COLORS.barBorder,
        borderWidth: 4,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0,
        order: 2,
        yAxisID: "y",
        datalabels: { display: false },
        tension: 0.45,
        segment: {
          borderDash: (ctx) => (ctx.p0.parsed.y < 0 ? [6, 4] : []),
        },
        borderJoinStyle: "round",
        borderCapStyle: "round",
      },
      // Green dots on top of bars
      {
        type: "line",
        label: "Net Dot",
        data: totalBar,
        borderColor: "rgba(0,0,0,0)",
        backgroundColor: COLORS.positive,
        pointBorderColor: COLORS.positive,
        pointBackgroundColor: COLORS.positive,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointBorderWidth: 2,
        showLine: false, // Only dots
        yAxisID: "y",
        order: 1,
        datalabels: { display: false },
      },
      // Growth trend line
      {
        type: "line",
        label: "Growth (%)",
        data: growthLine,
        borderColor: COLORS.growth,
        backgroundColor: COLORS.growth,
        borderWidth: 3,
        fill: false,
        pointRadius: 7,
        pointHoverRadius: 12,
        pointBackgroundColor: COLORS.growth,
        pointBorderWidth: 3,
        tension: 0.35,
        yAxisID: "y2",
        order: 0,
        datalabels: {
          display: growthLine.map((v) => v !== null && !isNaN(v)),
          anchor: "end",
          align: "bottom",
          clamp: true,
          color: "#facc15", // white text
          font: { weight: "bold", size: 15 },
          backgroundColor: "#101223",
          borderRadius: 7,
          borderWidth: 2,
          borderColor: "#23263a",
          padding: { left: 9, right: 9, top: 3, bottom: 3 },
          formatter: (val, ctx) => {
            // Always show a badge for 0
            if (val === null || isNaN(val)) return "";
            return `${formatPercent(val)}${
              val === 0 ? "" : " " + arrows[ctx.dataIndex]
            }`;
          },
        },
        spanGaps: false,
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
            if (ctx.dataset.label === "Net Result") {
              const raw = ctx.raw;
              if (raw > 0) return `🟢 Net: ${formatCurrency(raw, currency)}`;
              if (raw < 0)
                return `🔴 Net: -${formatCurrency(Math.abs(raw), currency)}`;
              return `Net: ${formatCurrency(raw, currency)}`;
            }
            if (ctx.dataset.label === "Growth (%)") {
              const raw = ctx.raw;
              if (raw === null || isNaN(raw)) {
                const prev = totalBar[ctx.dataIndex - 1];
                const curr = totalBar[ctx.dataIndex];
                if (ctx.dataIndex === 0) {
                  return "No growth data for first month.";
                }
                if (prev === 0) return "No growth %: previous month was $0.";
                if (curr === 0) return "No growth %: current month is $0.";
                return `--`;
              }
              if (raw === 0) return "";
              return `🟡 Growth: ${formatPercent(raw)} ${
                arrows[ctx.dataIndex]
              }`;
            }
            if (ctx.dataset.label === "Net Dot") {
              return `🟢 Net: ${formatCurrency(ctx.raw, currency)}`;
            }
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
        grid: {
          color: (ctx) => (ctx.tick.value === 0 ? "#fff" : "#282b41"),
          lineWidth: (ctx) => (ctx.tick.value === 0 ? 2 : 1),
        },
        beginAtZero: false,
        min: axis1Min,
        max: axis1Max,
        ticks: {
          color: "#b7bacf",
          font: { size: 15, weight: "bold" },
          callback: (val) => formatCurrency(val, currency),
        },
        title: { display: true, text: "Net Amount" },
      },
      y2: {
        position: "right",
        grid: {
          drawOnChartArea: true,
          color: (ctx) => (ctx.tick.value === 0 ? "#fff" : "#282b41"),
          lineWidth: (ctx) => (ctx.tick.value === 0 ? 2 : 1),
        },
        beginAtZero: false,
        min: axis2Min,
        max: axis2Max,
        ticks: {
          color: "#facc15",
          font: { size: 13, weight: "bold" },
          callback: (val) => formatPercent(val),
        },
        title: { display: true, text: "Growth (%)" },
      },
    },
  };

  return (
    <div className="w-full h-[500px] md:h-[420px]">
      <Bar data={chartData} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
}
