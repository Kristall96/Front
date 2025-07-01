import { useEffect, useState, useRef } from "react";
import secureAxios from "../../../utils/secureAxios";

// Widget imports (adjust path if needed)
import RevenueTrendsChart from "./widgets/RevenueTrendsChart";
import GrowthTrendChart from "./widgets/GrowthTrendChart";
import StatusBreakdownPie from "./widgets/StatusBreakdownPie";
import OverdueAgingBar from "./widgets/OverdueAgingBar";
import TopProductsBar from "./widgets/TopProductsBar";
import TopClientsBar from "./widgets/TopClientsBar";
import CategoryBreakdownDoughnut from "./widgets/CategoryBreakdownDoughnut";
import CurrencyBreakdownPie from "./widgets/CurrencyBreakdownPie";
import AvgPaymentSpeedStat from "./widgets/AvgPaymentSpeedStat";
import AlertsWidget from "./widgets/AlertsWidget";

// Analytic options (sync with backend)
const ANALYTIC_WIDGETS = [
  {
    type: "revenueTrends",
    label: "Monthly Income vs Outcome",
    Widget: RevenueTrendsChart,
    desc: "Visualize your total incomes, outcomes, and net result for each month.",
  },
  {
    type: "growth",
    label: "Growth Trend (%)",
    Widget: GrowthTrendChart,
    desc: "Track period-over-period revenue change in %.",
  },
  {
    type: "statusBreakdown",
    label: "Status Breakdown",
    Widget: StatusBreakdownPie,
    desc: "See how your invoices are distributed by status.",
  },
  {
    type: "overdueAging",
    label: "Overdue Aging",
    Widget: OverdueAgingBar,
    desc: "Breakdown of overdue unpaid invoices by aging bucket.",
  },
  {
    type: "topProducts",
    label: "Top Products",
    Widget: TopProductsBar,
    desc: "Top selling products (by value).",
  },
  {
    type: "topClients",
    label: "Top Clients",
    Widget: TopClientsBar,
    desc: "Clients who brought the most revenue.",
  },
  {
    type: "categoryBreakdown",
    label: "Category Breakdown",
    Widget: CategoryBreakdownDoughnut,
    desc: "Total value by category.",
  },
  {
    type: "currencyBreakdown",
    label: "Currency Breakdown",
    Widget: CurrencyBreakdownPie,
    desc: "Total invoice amounts by currency.",
  },
  {
    type: "avgPaymentSpeed",
    label: "Average Payment Speed",
    Widget: AvgPaymentSpeedStat,
    desc: "How fast are invoices paid (in days)?",
  },
  {
    type: "alerts",
    label: "Alerts & Warnings",
    Widget: AlertsWidget,
    desc: "Critical items: overdue, stale, or high-value unpaid invoices.",
  },
];

const DEFAULT_TYPE = ANALYTIC_WIDGETS[0].type;

const InvoiceAnalyticsModal = ({ onClose, showAll = false }) => {
  const [analyticType, setAnalyticType] = useState(DEFAULT_TYPE);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortControllerRef = useRef();

  // Find config for current analytic type
  const current = ANALYTIC_WIDGETS.find((x) => x.type === analyticType);
  const Widget = current.Widget;

  // Fetch analytics data for the selected type
  useEffect(() => {
    setLoading(true);
    setError("");
    setData(null);

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    let params = { analyticType };
    // Example: add custom params per analytic type if needed
    if (analyticType === "revenueTrends" || analyticType === "growth") {
      params.groupBy = "month";
      params.limit = 12;
    } else if (
      analyticType === "topProducts" ||
      analyticType === "topClients"
    ) {
      params.limit = 7;
    }
    if (showAll) params.all = true;
    secureAxios
      .get("/invoices/analytics", {
        params,
        signal: abortControllerRef.current.signal,
      })
      .then((res) => {
        // For overdueAging, convert bucket response to { label: {count, total} }
        if (analyticType === "overdueAging" && Array.isArray(res.data)) {
          // data like: [ { _id: "0", count: 2, total: 1000 }, ...]
          const bucketData = {};
          res.data.forEach((b) => {
            // You can customize labels here if desired
            let label = b._id;
            if (label === "0") label = "0–30 days";
            if (label === "31") label = "31–60 days";
            if (label === "61") label = "61–90 days";
            if (label === "91") label = "90+ days";
            bucketData[label] = { count: b.count, total: b.total };
          });
          setData(bucketData);
        } else {
          setData(res.data);
        }
      })
      .catch((err) => {
        if (err.code !== "ERR_CANCELED") {
          setError(
            err?.response?.data?.error ||
              err?.message ||
              "Failed to fetch analytics"
          );
        }
      })
      .finally(() => setLoading(false));

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [analyticType, showAll]);

  // Keyboard shortcut: Esc to close
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg">
      <div
        className="bg-[#23263a] text-white w-full max-w-[1150px] max-h-[98vh] rounded-xl p-2 shadow-2xl overflow-y-auto relative animate-fade-in"
        style={{ minHeight: 520 }}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-base bg-gray-700 hover:bg-gray-900 px-2 py-1 rounded"
          aria-label="Close analytics modal"
        >
          ✕
        </button>

        {/* Analytics selector (tab-style buttons) */}
        <div className="flex items-center gap-2 mb-2 mt-1 ml-2">
          <span className="text-2xl">📊</span>
          <span className="text-xl font-semibold">Invoice Analytics</span>
          <div className="flex gap-1 ml-7 flex-wrap">
            {ANALYTIC_WIDGETS.map((opt) => (
              <button
                key={opt.type}
                onClick={() => setAnalyticType(opt.type)}
                className={`px-3 py-1 rounded text-xs font-bold border shadow transition-all ${
                  analyticType === opt.type
                    ? "bg-sky-400 text-black border-sky-400"
                    : "bg-[#101223] text-white border-[#23263a] hover:bg-[#23263a] hover:text-sky-300"
                }`}
                style={{ minWidth: 88 }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="ml-2 mb-4 text-sm text-gray-400">{current.desc}</div>

        {/* Main analytics content */}
        <div className="w-full flex justify-center items-center mb-5">
          {loading ? (
            <div className="py-10 text-center text-gray-400 text-lg tracking-wide">
              Loading analytics...
            </div>
          ) : error ? (
            <div className="text-red-400 text-center">{error}</div>
          ) : data ? (
            <div className="w-full">
              <Widget data={data} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-56 text-gray-400 text-lg">
              <span>No data found.</span>
              <span className="text-xs text-gray-500 mt-2">
                Create invoices to unlock analytics!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceAnalyticsModal;
