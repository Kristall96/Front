// utils.js

export function formatCurrency(value, currency = "USD") {
  // Only format valid, positive or negative numbers
  if (typeof value !== "number" || isNaN(value)) return "";
  try {
    return value.toLocaleString(undefined, {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    });
  } catch {
    // fallback: plain number if currency code is invalid
    return value.toFixed(2);
  }
}

export function formatPercent(value) {
  if (typeof value !== "number" || isNaN(value)) return "";
  return `${value.toFixed(2)}%`;
}

export function getLastNMonths(n) {
  const arr = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    arr.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return arr;
}
export const COLORS = {
  income: "#38bdf8", // sky-400
  incomeStub: "#334155", // slate-800
  outcome: "#ef4444", // red-500
  outcomeStub: "#334155",
  net: "#22c55e", // green-500
  netFill: "#22c55e22", // transparent green
};
