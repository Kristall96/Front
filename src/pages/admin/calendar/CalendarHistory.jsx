import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import secureAxios from "../../../utils/secureAxios";

// Helper to diff events (edit)
function getEventDiff(prevEvent, newEvent) {
  if (!prevEvent || !newEvent) return [];
  const keys = Object.keys({ ...prevEvent, ...newEvent });
  return keys
    .filter(
      (key) =>
        prevEvent[key] !== newEvent[key] &&
        typeof prevEvent[key] !== "object" &&
        typeof newEvent[key] !== "object"
    )
    .map((key) => ({
      field: key,
      from: prevEvent[key],
      to: newEvent[key],
    }));
}

// Helper: pretty list all fields (with date formatting)
function renderFields(obj) {
  if (!obj) return null;
  const dateFields = ["updatedAt", "createdAt", "date"];
  return (
    <ul className="ml-3 mt-1 text-xs text-slate-400 flex flex-wrap gap-2">
      {Object.entries(obj)
        .filter(
          ([k, v]) =>
            typeof v !== "object" &&
            k !== "_id" &&
            k !== "__v" &&
            k !== "createdAt" &&
            k !== "updatedAt"
        )
        .map(([k, v]) => (
          <li key={k}>
            <b>{k}:</b> {dateFields.includes(k) ? formatDateTime(v) : String(v)}
          </li>
        ))}
    </ul>
  );
}

// Helper: Format date/time as YYYY-MM-DD HH:mm:ss
function formatDateTime(dt) {
  if (!dt) return "";
  const date = new Date(dt);
  if (isNaN(date)) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

// Helper: Full name (first + last or fallback)
function getFullName(user) {
  if (!user) return "Unknown";
  if (user.firstName && user.lastName)
    return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  if (user.username) return user.username;
  return "Unknown";
}

const ACTIONS = [
  { label: "All", value: "all", color: "" },
  { label: "Added", value: "add", color: "text-green-300" },
  { label: "Edited", value: "edit", color: "text-blue-300" },
  { label: "Deleted", value: "delete", color: "text-red-300" },
];

export default function CalendarHistory({ country, year }) {
  const [actionFilter, setActionFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["calendarChangeLog", country, year],
    queryFn: async () => {
      const res = await secureAxios.get(
        `/admin/calendars/${country}/${year}/changelog`
      );
      return res.data;
    },
  });

  const dateFields = ["updatedAt", "createdAt", "date"];

  // Filter + search memoized
  const filteredLogs = useMemo(() => {
    if (!data) return [];
    let logs = data.slice().reverse();
    if (actionFilter !== "all")
      logs = logs.filter((l) => l.action === actionFilter);
    if (search.trim()) {
      const lower = search.toLowerCase();
      logs = logs.filter((l) => {
        // Try to match title, description, or user
        const fields = [
          l.newEvent?.title,
          l.prevEvent?.title,
          l.newEvent?.description,
          l.prevEvent?.description,
          getFullName(l.user),
        ];
        return fields.some(
          (field) => field && String(field).toLowerCase().includes(lower)
        );
      });
    }
    return logs;
  }, [data, actionFilter, search]);

  // UI
  if (isLoading)
    return <div className="text-slate-200">Loading history...</div>;
  if (error) return <div className="text-red-400">Failed to load history.</div>;
  if (!data?.length)
    return <div className="text-slate-400">No changes found.</div>;

  return (
    <div className="rounded-lg bg-slate-800 p-4 shadow">
      <h2 className="text-xl font-bold mb-3 text-slate-100">Change Log</h2>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {ACTIONS.map((a) => (
          <button
            key={a.value}
            onClick={() => setActionFilter(a.value)}
            className={`px-3 py-1 rounded text-sm font-semibold border transition
              ${
                actionFilter === a.value
                  ? `bg-slate-700 border-teal-400 ${a.color}`
                  : "bg-slate-700 border-slate-600 text-slate-300"
              }
            `}
          >
            {a.label}
          </button>
        ))}
        <input
          className="ml-2 p-2 rounded bg-slate-700 text-white border border-slate-600 text-sm w-48"
          type="text"
          placeholder="Search by title, descr..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className="space-y-3">
        {filteredLogs.length === 0 && (
          <li className="text-slate-400 text-sm">
            No results match your filter.
          </li>
        )}
        {filteredLogs.map((log, idx) => (
          <li key={idx} className="p-3 rounded bg-slate-700">
            <div className="flex flex-wrap gap-2 items-center text-xs text-slate-300">
              <span className="uppercase font-semibold">{log.action}</span>
              <span>on {log.targetDate}</span>
              <span>by {getFullName(log.user)}</span>
              <span>at {formatDateTime(log.date)}</span>
              {log.comment && (
                <span className="italic text-slate-400">({log.comment})</span>
              )}
            </div>
            {/* ---- Edit: Show field-level changes ---- */}
            {log.action === "edit" && log.prevEvent && log.newEvent && (
              <div className="mt-2 text-xs">
                <b className="text-blue-300">Changed fields:</b>
                {getEventDiff(log.prevEvent, log.newEvent).length === 0 ? (
                  <span className="ml-2 text-slate-400">No changes</span>
                ) : (
                  <ul className="ml-2">
                    {getEventDiff(log.prevEvent, log.newEvent).map(
                      (diff, dIdx) => {
                        const isDateField = dateFields.includes(diff.field);
                        return (
                          <li key={dIdx}>
                            <span className="font-bold">{diff.field}</span>
                            :&nbsp;
                            <span className="text-red-300 line-through">
                              {isDateField
                                ? formatDateTime(diff.from)
                                : String(diff.from)}
                            </span>
                            &nbsp;→&nbsp;
                            <span className="text-green-300">
                              {isDateField
                                ? formatDateTime(diff.to)
                                : String(diff.to)}
                            </span>
                          </li>
                        );
                      }
                    )}
                  </ul>
                )}
              </div>
            )}
            {/* ---- Add: Show all new fields ---- */}
            {log.action === "add" && log.newEvent && (
              <div className="mt-2 text-xs text-green-300">
                <b>Added event fields:</b>
                {renderFields(log.newEvent)}
              </div>
            )}
            {/* ---- Delete: Show all previous fields ---- */}
            {log.action === "delete" && log.prevEvent && (
              <div className="mt-2 text-xs text-red-300">
                <b>Deleted event fields:</b>
                {renderFields(log.prevEvent)}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
