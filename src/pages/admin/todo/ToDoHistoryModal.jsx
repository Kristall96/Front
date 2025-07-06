import React, { useState } from "react";
import ReactDOM from "react-dom";
import HighlightSimpleDiff from "./HighlightSimpleDiff";

// Format timestamp
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Display user info
function displayUser(userObj) {
  if (!userObj) return "(unknown user)";
  if (userObj.firstName || userObj.lastName)
    return `${userObj.firstName || ""} ${userObj.lastName || ""}`.trim();
  return userObj.email || userObj.username || userObj._id || "(unknown user)";
}

// Expandable text utility (not a hook!)
function expandableText(text, limit = 120) {
  const str = String(text ?? "");
  if (str.length <= limit) return { isLong: false, preview: str, full: str };
  return { isLong: true, preview: str.slice(0, limit) + "...", full: str };
}

function ToDoHistoryModal({ open, onClose, history = [] }) {
  const [expanded, setExpanded] = useState({});

  if (!open) return null;

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const getActionColor = (action) => {
    switch (action) {
      case "updated":
        return "bg-blue-600 text-white";
      case "deleted":
        return "bg-rose-600 text-white";
      case "restored":
        return "bg-green-600 text-white";
      case "created":
        return "bg-teal-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getCardColor = (action) => {
    switch (action) {
      case "updated":
        return "bg-[#181f2e]/90 border-blue-900";
      case "deleted":
        return "bg-[#251b23]/90 border-rose-700";
      case "restored":
        return "bg-[#1d2d22]/90 border-green-700";
      case "created":
        return "bg-[#1d2d28]/90 border-teal-700";
      default:
        return "bg-[#22283a]/90 border-gray-800";
    }
  };

  // Toggle per-history item (single state per row)
  const handleExpand = (i) => {
    setExpanded((prev) => ({
      ...prev,
      [i]: !prev[i],
    }));
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 transition-colors duration-300">
      <div
        className="relative rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden animate-fade-in"
        style={{
          background: "#232e47",
          padding: "2.2rem 0 2rem 0",
        }}
      >
        <button
          className="absolute right-6 top-6 text-gray-300 hover:text-white text-2xl font-bold transition-colors"
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-extrabold mb-5 pl-8 pt-2 tracking-tight text-white">
          ToDo Change History
        </h2>
        <div
          className="
            max-h-[70vh]
            overflow-y-auto
            px-5
            custom-scrollbar-dark
            pb-1
            scroll-smooth
            transition-all
          "
        >
          {sortedHistory.length === 0 ? (
            <p className="text-gray-400 py-12 text-center">
              No history available.
            </p>
          ) : (
            <ul className="space-y-5">
              {sortedHistory.map((h, i) => {
                const oldText = expandableText(h.oldValue, 120);
                const newText = expandableText(h.newValue, 120);
                const isExpanded = !!expanded[i];
                const oldDisplay =
                  oldText.isLong && !isExpanded
                    ? oldText.preview
                    : oldText.full;
                const newDisplay =
                  newText.isLong && !isExpanded
                    ? newText.preview
                    : newText.full;

                return (
                  <li
                    key={i}
                    className={`
                      border-l-4 pl-5 pr-3 py-4
                      rounded-xl
                      shadow
                      ${getCardColor(h.action)}
                      transition-shadow
                      hover:shadow-lg
                    `}
                    style={{ minHeight: "86px" }}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`
                          text-xs px-2 py-0.5 rounded font-bold tracking-wide uppercase
                          ${getActionColor(h.action)}
                        `}
                      >
                        {h.action}
                      </span>
                      {h.field && (
                        <span className="text-[11px] bg-[#151b2b] text-gray-300 px-2 py-0.5 rounded font-mono tracking-tight border border-gray-700">
                          {h.field}
                        </span>
                      )}
                      <span className="text-[11px] text-gray-400 ml-auto tabular-nums">
                        {formatDate(h.timestamp)}
                      </span>
                    </div>
                    <div className="mt-1 text-sm">
                      {h.action === "updated" && (
                        <div className="space-y-1">
                          <div className="text-gray-300 font-medium">
                            {h.field} changed:
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 mt-1">
                            {/* FROM */}
                            <div
                              className={
                                "flex-1 break-words whitespace-pre-wrap text-xs leading-snug font-mono" +
                                (isExpanded && oldText.full.length > 400
                                  ? " max-h-[180px] overflow-y-auto custom-scrollbar-dark"
                                  : "")
                              }
                            >
                              <span className="text-gray-400 font-mono text-xs">
                                From:
                              </span>{" "}
                              <span className="text-rose-400">
                                "
                                <HighlightSimpleDiff
                                  oldText={oldDisplay}
                                  newText={newDisplay}
                                  type="old"
                                />
                                "
                              </span>
                            </div>
                            {/* TO */}
                            <div
                              className={
                                "flex-1 break-words whitespace-pre-wrap text-xs leading-snug font-mono" +
                                (isExpanded && newText.full.length > 400
                                  ? " max-h-[180px] overflow-y-auto custom-scrollbar-dark"
                                  : "")
                              }
                            >
                              <span className="text-gray-400 font-mono text-xs">
                                To:
                              </span>{" "}
                              <span className="text-green-400">
                                "
                                <HighlightSimpleDiff
                                  oldText={oldDisplay}
                                  newText={newDisplay}
                                  type="new"
                                />
                                "
                              </span>
                            </div>
                          </div>
                          {/* Single show more/less button for this row */}
                          {(oldText.isLong || newText.isLong) && (
                            <div className="pt-2">
                              <button
                                className="text-xs underline text-blue-300 hover:text-blue-100 transition"
                                onClick={() => handleExpand(i)}
                              >
                                {isExpanded ? "Show less" : "Show more"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      {h.action === "deleted" && (
                        <p className="text-rose-400 font-semibold flex items-center gap-1 mt-2">
                          🗑️ ToDo moved to trash.
                        </p>
                      )}
                      {h.action === "restored" && (
                        <p className="text-green-400 font-semibold flex items-center gap-1 mt-2">
                          ♻️ ToDo restored from trash.
                        </p>
                      )}
                      {h.action === "created" && (
                        <p className="text-teal-400 font-semibold flex items-center gap-1 mt-2">
                          ➕ ToDo created.
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-4 font-mono flex items-center gap-1">
                      By:{" "}
                      <span className="font-semibold text-white not-italic">
                        {displayUser(h.user)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <style>{`
        .custom-scrollbar-dark::-webkit-scrollbar {
          width: 9px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb {
          background: #273559;
          border-radius: 8px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-track {
          background: #151b2b;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px) scale(.97);}
          to   { opacity: 1; transform: none;}
        }
        .animate-fade-in {
          animation: fade-in 0.32s cubic-bezier(.5,1.4,.3,1) both;
        }
      `}</style>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root")
  );
}

export default ToDoHistoryModal;
