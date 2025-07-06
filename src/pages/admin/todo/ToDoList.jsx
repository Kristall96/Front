import { useState } from "react";
import ToDoItem from "./ToDoItem";

const STATUS_TABS = [
  { label: "Open", value: "open" },
  { label: "Done", value: "done" },
  { label: "All", value: "all" },
  { label: "Trash", value: "trash" },
];

// Utility for safe assignedTo comparison
function isAssignedTo(todo, userId) {
  if (!todo.assignedTo) {
    // Collaborative: allow access for anyone (adjust logic as needed)
    return todo.type === "collaborative";
  }
  if (typeof todo.assignedTo === "string") return todo.assignedTo === userId;
  if (typeof todo.assignedTo === "object" && todo.assignedTo._id)
    return todo.assignedTo._id === userId;
  return false;
}

// Utility: who should see this trashed todo?
function isTrashVisible(todo, userId, userRole) {
  if (!todo.deletedAt) return false;
  if (userRole === "admin") return true;
  // Users: show if created by or assigned to current user, or collaborative
  const assigned = todo.assignedTo
    ? typeof todo.assignedTo === "object"
      ? todo.assignedTo._id === userId
      : todo.assignedTo === userId
    : false;
  const created =
    typeof todo.createdBy === "object"
      ? todo.createdBy._id === userId
      : todo.createdBy === userId;
  const isCollab = todo.type === "collaborative";
  return assigned || created || isCollab;
}

export default function ToDoList({
  todos = [],
  type = "personal", // "personal" | "collaborative"
  userId,
  userRole,
  onEdit,
  onDelete,
  onMarkDone,
  onRestore,
  onHardDelete,
}) {
  const [status, setStatus] = useState("all");

  // Always sort newest first
  const sortedTodos = [...todos].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // --- FILTERING LOGIC FIXED ---
  let filtered = [];
  if (status === "trash") {
    // Trash: show *deleted* todos of the current type, visible to user
    filtered = sortedTodos.filter(
      (t) => t.type === type && isTrashVisible(t, userId, userRole)
    );
  } else {
    // Not trash:
    if (type === "collaborative") {
      // Show all collaborative todos (not deleted)
      filtered = sortedTodos.filter(
        (t) => t.type === "collaborative" && !t.deletedAt
      );
    } else {
      // Personal: only assigned to you and not deleted
      filtered = sortedTodos.filter(
        (t) => t.type === "personal" && !t.deletedAt && isAssignedTo(t, userId)
      );
    }
  }

  // Further status filtering
  let statusFiltered = [];
  if (status === "all" || status === "trash") {
    statusFiltered = filtered;
  } else if (status === "open") {
    statusFiltered = filtered.filter((t) => t.status !== "done");
  } else if (status === "done") {
    statusFiltered = filtered.filter((t) => t.status === "done");
  }

  // Tab counts (ensure trash uses fixed logic!)
  const counts = {
    all:
      type === "collaborative"
        ? sortedTodos.filter((t) => t.type === "collaborative" && !t.deletedAt)
            .length
        : sortedTodos.filter(
            (t) =>
              t.type === "personal" && !t.deletedAt && isAssignedTo(t, userId)
          ).length,

    open:
      type === "collaborative"
        ? sortedTodos.filter(
            (t) =>
              t.type === "collaborative" && !t.deletedAt && t.status !== "done"
          ).length
        : sortedTodos.filter(
            (t) =>
              t.type === "personal" &&
              !t.deletedAt &&
              t.status !== "done" &&
              isAssignedTo(t, userId)
          ).length,

    done:
      type === "collaborative"
        ? sortedTodos.filter(
            (t) =>
              t.type === "collaborative" && !t.deletedAt && t.status === "done"
          ).length
        : sortedTodos.filter(
            (t) =>
              t.type === "personal" &&
              !t.deletedAt &&
              t.status === "done" &&
              isAssignedTo(t, userId)
          ).length,

    trash:
      type === "collaborative"
        ? sortedTodos.filter(
            (t) =>
              t.type === "collaborative" && isTrashVisible(t, userId, userRole)
          ).length
        : sortedTodos.filter(
            (t) => t.type === "personal" && isTrashVisible(t, userId, userRole)
          ).length,
  };

  return (
    <div>
      {/* Status Tabs */}
      <div className="flex gap-3 mb-6 px-1">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setStatus(t.value)}
            className={`
              group relative flex items-center gap-2 px-5 py-2
              rounded-xl border transition font-medium
              ${
                status === t.value
                  ? "bg-blue-700/90 text-white border-blue-500"
                  : "bg-transparent text-slate-300 border-slate-700 hover:bg-slate-800/80 hover:text-white"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-300/50
              duration-100
            `}
            style={{
              minWidth: 90,
              justifyContent: "center",
            }}
          >
            <span className="tracking-wide">{t.label}</span>
            <span
              className={`
                ml-2 flex items-center justify-center
                w-6 h-6 min-w-[1.5rem] min-h-[1.5rem]
                rounded-full font-bold text-xs
                ${
                  status === t.value
                    ? "bg-white text-blue-700 shadow-sm"
                    : "bg-slate-700 text-slate-200 group-hover:bg-white/80 group-hover:text-blue-700"
                }
                border border-white/10
                transition
              `}
              style={{ lineHeight: 1.1 }}
            >
              {counts[t.value]}
            </span>
          </button>
        ))}
      </div>
      {/* List */}
      {statusFiltered.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          No To Dos in this tab.
        </div>
      ) : (
        <div className="space-y-6">
          {statusFiltered.map((todo, idx) => (
            <ToDoItem
              key={todo._id}
              todo={todo}
              onEdit={onEdit}
              onDelete={onDelete}
              onMarkDone={onMarkDone}
              onRestore={onRestore}
              onHardDelete={onHardDelete}
              userId={userId}
              userRole={userRole}
              idx={idx}
              isTrash={status === "trash"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
