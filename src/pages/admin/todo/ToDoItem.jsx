import ToDoHistoryModal from "./ToDoHistoryModal";
import { useState } from "react";
import {
  CheckCircle,
  RotateCcw,
  Edit,
  Trash2,
  Undo2,
  XCircle,
  Info,
} from "lucide-react";

// Format date utility
function formatDate(dateStr, withTime = true) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return withTime
    ? date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : date.toLocaleDateString();
}

function displayUser(userObj) {
  if (!userObj) return "-";
  if (userObj.firstName || userObj.lastName)
    return `${userObj.firstName || ""} ${userObj.lastName || ""}`.trim();
  if (userObj.email) return userObj.email;
  return userObj.username || userObj._id || "-";
}

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full relative">
        <button
          className="absolute right-3 top-3 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

// Show time left until permanent delete
function getTimeLeftText(permanentDeleteAt) {
  if (!permanentDeleteAt) return null;
  const ms = new Date(permanentDeleteAt) - new Date();
  if (ms < 0) return "Pending permanent deletion";
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  return `Auto-deletes in ${days}d ${hours}h ${minutes}m`;
}

// Utility: who can soft delete this todo
function canSoftDelete(todo, userId, userRole) {
  if (userRole === "admin") return true;
  if (todo.createdBy) {
    if (typeof todo.createdBy === "object" && todo.createdBy._id === userId)
      return true;
    if (typeof todo.createdBy === "string" && todo.createdBy === userId)
      return true;
  }
  if (todo.type === "collaborative" && userRole === "moderator") return true;
  return false;
}

export default function ToDoItem({
  todo,
  onEdit,
  onDelete, // Soft delete (move to trash)
  onMarkDone,
  onRestore, // Only in trash
  onHardDelete, // Only in trash
  userId,
  userRole,
  idx,
  isMarking,
  isTrash = false,
}) {
  const [expanded, setExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Styling
  const statusBg =
    todo.status === "done" ? "bg-gray-100/70" : "bg-slate-800/80";
  const mainText = todo.status === "done" ? "text-gray-700" : "text-white";
  const subText = todo.status === "done" ? "text-gray-600" : "text-gray-300";
  const tagText =
    todo.status === "done"
      ? "bg-gray-300 text-gray-700"
      : "bg-slate-600 text-white";
  const statusPill =
    todo.status === "done"
      ? "bg-green-200 text-gray-700"
      : todo.status === "in_progress"
      ? "bg-blue-800 text-blue-200"
      : todo.status === "blocked"
      ? "bg-red-800 text-red-200"
      : "bg-slate-700 text-slate-100";

  return (
    <div
      className={`
        ${statusBg}
        rounded-2xl shadow px-6 py-5 border border-slate-800
        relative group transition-all duration-150
        backdrop-blur-sm
        ${expanded ? "pb-7" : ""}
      `}
    >
      <div className="flex flex-row justify-between items-start gap-2">
        {/* Title & CreatedAt */}
        <div className="flex-1 min-w-0">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setExpanded((e) => !e)}
            title="Show/hide description"
          >
            {typeof idx === "number" && (
              <span
                className={`font-mono text-xs px-2 py-0.5 mr-2 opacity-70 rounded ${
                  todo.status === "done"
                    ? "bg-gray-300 text-gray-700"
                    : "bg-slate-600 text-white"
                }`}
              >
                #{idx + 1}
              </span>
            )}
            <h2
              className={`
                text-lg md:text-xl font-bold group-hover:underline line-clamp-1 transition-all
                ${mainText}
                ${
                  todo.status === "done"
                    ? "line-through decoration-2 decoration-gray-400 decoration-center"
                    : ""
                }
              `}
            >
              {todo.title}
            </h2>
            <span className={`ml-2 text-xs hidden md:inline ${subText}`}>
              {formatDate(todo.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusPill}`}
          >
            {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Description (expand/collapse) */}
      <div className="mt-3">
        <button
          onClick={() => setExpanded((e) => !e)}
          className={`text-left text-sm hover:underline focus:outline-none mb-1 ${
            todo.status === "done" ? "text-blue-600" : "text-blue-400"
          }`}
        >
          {expanded ? "Hide Details ▲" : "Show Details ▼"}
        </button>
        {expanded && (
          <div
            className={`mt-2 p-3 rounded-md shadow-inner transition-all ${
              todo.status === "done" ? "bg-gray-200" : "bg-[#232942]"
            }`}
          >
            <div
              className={`${mainText} text-base whitespace-pre-line break-words`}
            >
              {todo.description || (
                <span className={subText}>No description.</span>
              )}
            </div>
            {todo.subtasks && todo.subtasks.length > 0 && (
              <ul className="list-disc ml-5 mt-3 space-y-1">
                {todo.subtasks.map((st, i) => (
                  <li
                    key={i}
                    className={`
                      text-sm
                      ${st.done ? "line-through text-green-400" : mainText}
                    `}
                  >
                    {st.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Tags & Details */}
      <div
        className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs mt-3 ${subText}`}
      >
        {/* Tags */}
        {todo.tags && todo.tags.length > 0 && (
          <div className="flex gap-1">
            {todo.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`inline-block px-2 py-0.5 rounded ${tagText}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Priority, Due, Type */}
        <span>
          Priority:{" "}
          <span
            className={`font-semibold ${
              todo.priority === "high"
                ? "text-red-500"
                : todo.priority === "medium"
                ? "text-yellow-600"
                : ""
            }`}
          >
            {todo.priority}
          </span>
        </span>
        {todo.dueDate && (
          <span>
            Due: {formatDate(todo.dueDate)}{" "}
            {new Date(todo.dueDate).toDateString() ===
              new Date().toDateString() && (
              <span className="text-green-600">(today)</span>
            )}
          </span>
        )}
        <span>
          Type:{" "}
          <span
            className={
              todo.status === "done" ? "text-blue-800" : "text-blue-300"
            }
          >
            {todo.type}
          </span>
        </span>

        {/* Assigned To */}
        {todo.assignedTo && (
          <span>
            Assigned:{" "}
            <b
              className={
                todo.status === "done" ? "text-purple-800" : "text-purple-300"
              }
            >
              {displayUser(todo.assignedTo)}
            </b>
          </span>
        )}

        {/* Assignment Note */}
        {todo.assignmentNote && todo.assignmentNote.trim() && (
          <span>
            Note:{" "}
            <span
              className={
                todo.status === "done"
                  ? "italic text-blue-800"
                  : "italic text-blue-200"
              }
            >
              {todo.assignmentNote}
            </span>
          </span>
        )}

        {/* Created By */}
        {todo.createdBy && (
          <span>
            Created by:{" "}
            <b className="text-teal-400">{displayUser(todo.createdBy)}</b>
          </span>
        )}

        {/* Deleted By (if in trash) */}
        {todo.deletedAt && todo.deletedBy && (
          <span>
            Deleted by:{" "}
            <b className="text-rose-400">{displayUser(todo.deletedBy)}</b>
            {todo.deletedAt && (
              <span className="ml-2 text-red-200">
                on {formatDate(todo.deletedAt)}
              </span>
            )}
          </span>
        )}

        {/* Restored By */}
        {todo.restoredBy && (
          <span>
            Restored by:{" "}
            <b className="text-green-400">{displayUser(todo.restoredBy)}</b>
            {todo.restoredAt && (
              <span className="ml-2 text-green-200">
                on {formatDate(todo.restoredAt)}
              </span>
            )}
          </span>
        )}
      </div>

      {/* Trash Actions (only in Trash tab) */}
      {isTrash ? (
        <>
          {/* Permanent delete info */}
          <div className="mt-2 text-xs text-red-400 flex items-center gap-2">
            <XCircle size={14} className="inline mr-1" />
            {todo.permanentDeleteAt && (
              <>
                Scheduled for permanent deletion:&nbsp;
                <b>{formatDate(todo.permanentDeleteAt)}</b>
                <span className="ml-2 text-red-300/80 italic">
                  {getTimeLeftText(todo.permanentDeleteAt)}
                </span>
              </>
            )}
          </div>
          {/* Trash actions */}
          <div className="flex flex-row gap-2 mt-4">
            <button
              onClick={() => setShowHistory(true)}
              aria-label="View History"
              className="
                w-8 h-8 flex items-center justify-center rounded-full shadow-sm
                transition-all duration-150 bg-slate-700 hover:bg-slate-600 focus:outline-none
              "
            >
              <Info size={18} className="text-blue-300" />
            </button>
            <button
              onClick={() => onRestore(todo)}
              className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded shadow"
            >
              <Undo2 size={16} className="inline mr-1" />
              Restore
            </button>
            {(userRole === "admin" ||
              (todo.createdBy &&
                ((typeof todo.createdBy === "object" &&
                  todo.createdBy._id === userId) ||
                  (typeof todo.createdBy === "string" &&
                    todo.createdBy === userId)))) && (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Permanently delete this To Do? This cannot be undone."
                    )
                  )
                    onHardDelete(todo);
                }}
                className="bg-rose-700 hover:bg-rose-800 text-white px-3 py-1 rounded shadow"
              >
                <Trash2 size={16} className="inline mr-1" />
                Delete Forever
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-row items-center gap-2 absolute bottom-6 right-8 z-10">
          {/* Info/History button */}
          <button
            onClick={() => setShowHistory(true)}
            aria-label="View History"
            className="
              w-8 h-8 flex items-center justify-center rounded-full shadow-sm
              transition-all duration-150 bg-slate-700 hover:bg-slate-600 focus:outline-none
            "
          >
            <Info size={18} className="text-blue-300" />
          </button>
          {/* Toggle Done/Undo */}
          <button
            onClick={() =>
              todo.status === "done"
                ? onMarkDone(todo, "todo")
                : onMarkDone(todo, "done")
            }
            disabled={isMarking}
            aria-label={todo.status === "done" ? "Undo Done" : "Mark as Done"}
            className={`
              w-8 h-8 flex items-center justify-center rounded-full shadow-sm
              transition-all duration-150 focus:outline-none focus:ring-2
              ${
                todo.status === "done"
                  ? "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-300"
                  : "bg-transparent hover:bg-emerald-600/90 focus:ring-emerald-300"
              }
            `}
          >
            {todo.status === "done" ? (
              <RotateCcw
                size={18}
                className={`${
                  todo.status === "done"
                    ? "text-white"
                    : "text-emerald-400 group-hover:text-white"
                }`}
              />
            ) : (
              <CheckCircle
                size={18}
                className={`${
                  todo.status === "done"
                    ? "text-white"
                    : "text-emerald-400 group-hover:text-white"
                }`}
              />
            )}
          </button>
          {/* Edit */}
          <button
            onClick={() => onEdit(todo)}
            aria-label="Edit"
            className={`
              w-8 h-8 flex items-center justify-center rounded-full shadow-sm
              transition-all duration-150 focus:outline-none focus:ring-2
              ${
                todo.status === "done"
                  ? "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300"
                  : "bg-transparent hover:bg-blue-600/90 focus:ring-blue-300"
              }
            `}
          >
            <Edit
              size={18}
              className={`${
                todo.status === "done"
                  ? "text-white"
                  : "text-blue-400 group-hover:text-white"
              }`}
            />
          </button>
          {/* Soft Delete (Move to Trash): Use canSoftDelete */}
          {canSoftDelete(todo, userId, userRole) && (
            <button
              onClick={() => onDelete(todo)}
              aria-label="Move to Trash"
              className={`
                w-8 h-8 flex items-center justify-center rounded-full shadow-sm
                transition-all duration-150 focus:outline-none focus:ring-2
                ${
                  todo.status === "done"
                    ? "bg-rose-500 hover:bg-rose-600 focus:ring-rose-300"
                    : "bg-transparent hover:bg-rose-600/90 focus:ring-rose-300"
                }
              `}
            >
              <Trash2
                size={18}
                className={`${
                  todo.status === "done"
                    ? "text-white"
                    : "text-red-400 group-hover:text-white"
                }`}
              />
            </button>
          )}
        </div>
      )}
      {/* History Modal */}
      <ToDoHistoryModal
        open={showHistory}
        onClose={() => setShowHistory(false)}
        history={todo.history}
      />
    </div>
  );
}
