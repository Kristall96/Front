import React from "react";
import { useAuth } from "../../../context/AuthContext"; // adjust path as needed

function AssignedToDisplay({ assignedTo, currentUserId }) {
  if (!assignedTo) return <span className="text-gray-400">—</span>;
  if (assignedTo._id === currentUserId)
    return <span className="text-blue-300 font-semibold">You</span>;
  return (
    <span>
      {/* You can add an avatar here if available */}
      {assignedTo.firstName} {assignedTo.lastName}
      {assignedTo.email && (
        <span className="text-xs text-gray-400 ml-1">({assignedTo.email})</span>
      )}
    </span>
  );
}

export default function ViewComplaint({ open, onClose, complaint }) {
  const { user } = useAuth();

  if (!open || !complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl p-7 max-w-lg w-full shadow-2xl text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-1">{complaint.subject}</h2>
        <div className="text-xs text-gray-400 mb-4">
          #{complaint._id.slice(-6)}
        </div>

        <div className="space-y-3">
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs
                ${
                  complaint.status === "Open"
                    ? "bg-green-600"
                    : complaint.status === "Under Review"
                    ? "bg-yellow-600"
                    : complaint.status === "Resolved"
                    ? "bg-blue-600"
                    : "bg-gray-600"
                }`}
            >
              {complaint.status}
            </span>
          </div>

          <div>
            <span className="font-semibold">Category:</span>{" "}
            {complaint.category}
          </div>

          <div>
            <span className="font-semibold">Channel:</span> {complaint.channel}
          </div>

          <div>
            <span className="font-semibold">Assigned To:</span>{" "}
            <AssignedToDisplay
              assignedTo={complaint.assignedTo}
              currentUserId={user?._id}
            />
          </div>

          <div>
            <span className="font-semibold">Submitted:</span>{" "}
            {complaint.timeline?.submitted
              ? new Date(complaint.timeline.submitted).toLocaleString()
              : complaint.createdAt
              ? new Date(complaint.createdAt).toLocaleString()
              : "-"}
          </div>

          <div>
            <span className="font-semibold">Description:</span>
            <div className="mt-1 bg-slate-700 rounded p-3 text-sm whitespace-pre-line">
              {complaint.description}
            </div>
          </div>

          {/* Show tags, notes, feedback, etc. here if you want */}
        </div>
      </div>
    </div>
  );
}
