import { useComplaints, useAssignComplaint } from "./hooks/useComplaint";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getAssignedToLabel } from "../../../utils/getAssignedToLabel";
import ViewComplaint from "./ViewComplaint";

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

// Quick status icons
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

// Each row
function ComplaintRow({
  c,
  onAssign,
  assigning,
  assignError,
  onView,
  currentUserId,
}) {
  const assignedToLabel = getAssignedToLabel(c.assignedTo, currentUserId);
  return (
    <tr className="border-b last:border-b-0 hover:bg-blue-950/60 transition group">
      <td className="px-4 py-3 font-mono text-xs text-blue-400">
        {c._id.slice(-6)}
      </td>
      <td className="px-4 py-3 truncate max-w-xs" title={c.subject}>
        <span className="font-semibold text-slate-200">{c.subject}</span>
      </td>
      <td className="px-4 py-3">
        <span
          className={`
          px-2 py-1 rounded-full text-xs font-bold
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
      <td className="px-4 py-3">
        {c.category || <span className="text-gray-400">-</span>}
      </td>
      <td className="px-4 py-3 capitalize">
        {c.channel || <span className="text-gray-400">-</span>}
      </td>
      <td className="px-4 py-3">
        <TagList tags={c.tags} />
      </td>
      <td className="px-4 py-3">{assignedToLabel}</td>
      <td className="px-4 py-3">
        {c.timeline?.assigned
          ? new Date(c.timeline.assigned).toLocaleDateString()
          : "-"}
      </td>
      <td className="px-4 py-3">
        {c.timeline?.submitted
          ? new Date(c.timeline.submitted).toLocaleDateString()
          : c.createdAt
          ? new Date(c.createdAt).toLocaleDateString()
          : "-"}
      </td>
      <td className="px-4 py-3">
        <QuickStatusIcons {...c} />
      </td>
      <td className="px-4 py-3 space-x-2">
        {!c.assignedTo && (
          <button
            onClick={onAssign}
            disabled={assigning}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition shadow-sm"
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

// MAIN COMPONENT
export default function ComplaintList({ tab = "all" }) {
  const { data: complaints = [], isLoading, isError, error } = useComplaints();
  const assignMutation = useAssignComplaint();
  const { user } = useAuth();
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

  const assignedComplaints = complaints.filter(
    (c) => c.assignedTo && c.assignedTo._id === user?._id
  );
  const visibleComplaints =
    tab === "assigned" ? assignedComplaints : complaints;

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[30vh] text-blue-300">
        Loading complaints…
      </div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center min-h-[30vh] text-red-400">
        {error.message}
      </div>
    );
  if (visibleComplaints.length === 0)
    return (
      <div className="flex items-center justify-center min-h-[30vh] text-slate-400">
        No complaints found.
      </div>
    );

  return (
    <section className="w-full bg-slate-800 rounded-xl shadow-lg p-0 border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-white border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-slate-900/95 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold text-left">ID</th>
              <th className="px-4 py-3 font-semibold text-left">Subject</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Channel</th>
              <th className="px-4 py-3 font-semibold">Tags</th>
              <th className="px-4 py-3 font-semibold">Assigned To</th>
              <th className="px-4 py-3 font-semibold">Assigned At</th>
              <th className="px-4 py-3 font-semibold">Submitted</th>
              <th className="px-4 py-3 font-semibold">Flags</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleComplaints.map((c) => (
              <ComplaintRow
                key={c._id}
                c={c}
                onAssign={() => assignMutation.mutate(c._id)}
                assigning={assignMutation.isLoading}
                assignError={
                  assignMutation.isError ? assignMutation.error : null
                }
                onView={() => handleView(c)}
                currentUserId={user?._id}
              />
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal for viewing details */}
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
