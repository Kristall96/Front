import { useState } from "react";
import ViewComplaint from "./ViewComplaint";
import { getAssignedToLabel } from "../../../utils/getAssignedToLabel";

// Tag pill
function TagList({ tags }) {
  if (!tags || tags.length === 0)
    return <span className="text-gray-400">-</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="inline-block bg-blue-950 px-2 py-0.5 rounded text-xs text-blue-200"
          title={tag}
        >
          {tag.length > 12 ? tag.slice(0, 12) + "…" : tag}
        </span>
      ))}
    </div>
  );
}

function QuickStatusIcons({ isEscalated, feedback, notes, messages }) {
  return (
    <span className="flex gap-1 items-center">
      {isEscalated && (
        <span title="Escalated" className="text-red-400 font-bold">
          🚩
        </span>
      )}
      {feedback && (
        <span title={`Feedback: ${feedback.rating || "-"}★`}>⭐</span>
      )}
      {Array.isArray(notes) && notes.length > 0 && (
        <span title={`${notes.length} Notes`} className="text-purple-400">
          📝
        </span>
      )}
      {Array.isArray(messages) && messages.length > 0 && (
        <span title={`${messages.length} Messages`} className="text-blue-300">
          💬
        </span>
      )}
    </span>
  );
}

// Complaint row
function ComplaintRow({
  c,
  onAssign,
  assigning,
  assignError,
  onView,
  currentUserId,
}) {
  const assignedToLabel = getAssignedToLabel(c.assignedTo, currentUserId);
  const canAssign = !c.assignedTo && typeof onAssign === "function";
  return (
    <tr className="border-b last:border-b-0 hover:bg-blue-950/60 transition group">
      <td className="px-3 py-2 min-w-[60px] font-mono text-xs text-blue-400 truncate">
        {c._id.slice(-6)}
      </td>
      <td className="px-3 py-2 max-w-[220px] truncate" title={c.subject}>
        <span className="font-semibold text-slate-200">{c.subject}</span>
      </td>
      <td className="px-3 py-2 text-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold
            ${
              c.status === "Open"
                ? "bg-green-700 text-green-100"
                : c.status === "Under Review"
                ? "bg-yellow-700 text-yellow-100"
                : c.status === "Resolved"
                ? "bg-blue-700 text-blue-100"
                : "bg-slate-600 text-slate-100"
            }
          `}
        >
          {c.status}
        </span>
      </td>
      <td className="px-3 py-2 text-center">
        {c.category || <span className="text-gray-400">-</span>}
      </td>
      <td className="px-3 py-2 capitalize text-center">
        {c.channel || <span className="text-gray-400">-</span>}
      </td>
      <td className="px-3 py-2 max-w-[160px]">
        <TagList tags={c.tags} />
      </td>
      <td className="px-3 py-2 text-center">{assignedToLabel}</td>
      <td className="px-3 py-2 text-center">
        {c.timeline?.assigned
          ? new Date(c.timeline.assigned).toLocaleDateString()
          : "-"}
      </td>
      <td className="px-3 py-2 text-center">
        {c.timeline?.submitted
          ? new Date(c.timeline.submitted).toLocaleDateString()
          : c.createdAt
          ? new Date(c.createdAt).toLocaleDateString()
          : "-"}
      </td>
      <td className="px-3 py-2 text-center">
        <QuickStatusIcons {...c} />
      </td>
      <td className="px-3 py-2 text-right">
        {canAssign && (
          <button
            onClick={onAssign}
            disabled={assigning}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition shadow-sm mr-2"
          >
            {assigning ? "Assigning..." : "Assign to Me"}
          </button>
        )}
        <button
          onClick={onView}
          className="bg-slate-600 hover:bg-blue-600 text-white px-2 py-1 rounded transition shadow-sm group-hover:bg-blue-700"
        >
          View
        </button>
        {assignError && (
          <span className="text-xs text-red-400 block mt-1">
            Failed to assign: {assignError.message || "Unknown error"}
          </span>
        )}
      </td>
    </tr>
  );
}

// Main component
export default function ComplaintList({
  complaints = [],
  isLoading = false,
  emptyText = "No complaints found.",
  onAssign,
  assigning = {},
  assignError = {},
  currentUserId,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const handleView = (complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedComplaint(null);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[30vh] text-blue-300">
        Loading complaints…
      </div>
    );
  if (!complaints.length)
    return (
      <div className="flex items-center justify-center min-h-[30vh] text-slate-400">
        {emptyText}
      </div>
    );

  return (
    <section className="w-full bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-white border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-slate-900/95 border-b border-slate-700">
            <tr>
              <th className="px-3 py-2 min-w-[60px] text-left">ID</th>
              <th className="px-3 py-2 text-left">Subject</th>
              <th className="px-3 py-2 text-center">Status</th>
              <th className="px-3 py-2 text-center">Category</th>
              <th className="px-3 py-2 text-center">Channel</th>
              <th className="px-3 py-2 text-left">Tags</th>
              <th className="px-3 py-2 text-center">Assigned To</th>
              <th className="px-3 py-2 text-center">Assigned At</th>
              <th className="px-3 py-2 text-center">Submitted</th>
              <th className="px-3 py-2 text-center">Flags</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <ComplaintRow
                key={c._id}
                c={c}
                onAssign={onAssign ? () => onAssign(c._id) : undefined}
                assigning={assigning[c._id]}
                assignError={assignError[c._id]}
                onView={() => handleView(c)}
                currentUserId={currentUserId}
              />
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white max-w-lg w-full rounded-xl p-6 shadow-2xl relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-xl text-slate-500 hover:text-blue-600 transition"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <ViewComplaint
              open={modalOpen}
              onClose={closeModal}
              complaint={selectedComplaint}
            />
          </div>
        </div>
      )}
    </section>
  );
}
