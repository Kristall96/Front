import {
  useComplaints,
  useComplaintWithPolling,
  useAdminComplaintMessage,
} from "./hooks/useComplaint";
import { useAuth } from "../../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useUpdateComplaintStatus } from "./hooks/useComplaint";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "Under Review", label: "Under Review" },
  { value: "Resolved", label: "Resolved" },
  { value: "Closed", label: "Closed" },
];
function ConfirmModal({ open, onClose, onConfirm, message }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#232c3d] rounded-xl shadow-xl p-6 min-w-[320px] text-white flex flex-col gap-4">
        <div className="text-base font-semibold">{message}</div>
        <div className="flex gap-3 justify-end">
          <button
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold"
            onClick={onConfirm}
            type="button"
          >
            Yes, change
          </button>
        </div>
      </div>
    </div>
  );
}
function ComplaintStatusDropdown({ status, complaintId, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef(null);
  const updateStatus = useUpdateComplaintStatus();

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newStatus) => {
    if (newStatus === status) return setOpen(false);
    setPendingStatus(newStatus);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setShowModal(false);
    setOpen(false);
    try {
      await updateStatus.mutateAsync({
        id: complaintId,
        status: pendingStatus,
      });
      onStatusChange?.(pendingStatus);
      toast.success("Status updated!"); // <-- Success message
    } catch (err) {
      // Show error toast with fallback message
      toast.error(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to update status. Please try again."
      );
    }
    setPendingStatus(null);
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center min-w-[140px] px-4 py-2 rounded-lg bg-[#1e2538] text-white border border-slate-700 shadow font-semibold transition hover:bg-sky-700 focus:ring-2 focus:ring-sky-400"
        onClick={() => setOpen((v) => !v)}
        type="button"
        disabled={updateStatus.isLoading}
      >
        {status}
        <svg
          className="ml-2 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <ul className="absolute right-0 z-10 mt-2 bg-[#232c3d] border border-slate-700 rounded-xl shadow-lg min-w-[140px] py-1">
          {["Under Review", "Resolved", "Closed"].map((opt) => (
            <li key={opt}>
              <button
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition
                  ${
                    opt === status
                      ? "bg-slate-900 text-sky-300 cursor-not-allowed"
                      : "hover:bg-blue-500 hover:text-white text-white"
                  }
                `}
                onClick={() => handleSelect(opt)}
                disabled={opt === status}
                type="button"
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal for confirmation */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#232c3d] rounded-xl shadow-xl p-6 min-w-[320px] text-white flex flex-col gap-4">
            <div className="text-base font-semibold">
              Are you sure you want to change the status to "{pendingStatus}"?
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
                onClick={() => setShowModal(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold flex items-center justify-center"
                onClick={handleConfirm}
                type="button"
                disabled={updateStatus.isLoading}
              >
                {updateStatus.isLoading && (
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="white"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                Yes, change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// Helper for initials
const getInitials = (name, fallback = "U") =>
  (name || fallback)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getRoleInfo = (role) => {
  if (role === "admin") return { name: "Admin", initials: "A" };
  if (role === "moderator") return { name: "Moderator", initials: "M" };
  if (role === "user") return { name: "Customer", initials: "C" };
  return { name: "User", initials: "U" };
};

function buildMessages(complaint) {
  if (!complaint) return [];
  const msgs = Array.isArray(complaint.messages) ? complaint.messages : [];
  const needsDescription =
    complaint.description &&
    (!msgs.length || msgs[0].message !== complaint.description);
  const descriptionMsg = needsDescription
    ? [
        {
          role: "user",
          message: complaint.description,
          sentAt: complaint.createdAt || Date.now(),
          isDescription: true,
        },
      ]
    : [];
  return descriptionMsg.concat(msgs);
}

export default function ComplaintResponses() {
  const { user } = useAuth();
  const { data: complaints = [], isLoading } = useComplaints();
  const assignedComplaints = complaints.filter(
    (c) =>
      c.assignedTo &&
      c.assignedTo._id === user?._id &&
      c.status !== "Resolved" &&
      c.status !== "Closed"
  );
  const [selectedId, setSelectedId] = useState(
    assignedComplaints[0]?._id || null
  );

  useEffect(() => {
    if (
      (!selectedId || !assignedComplaints.find((c) => c._id === selectedId)) &&
      assignedComplaints.length
    ) {
      setSelectedId(assignedComplaints[0]._id);
    }
  }, [assignedComplaints, selectedId]);

  const selectedComplaint = assignedComplaints.find(
    (c) => c._id === selectedId
  );

  if (isLoading)
    return (
      <div className="flex h-96 items-center justify-center text-gray-400">
        Loading complaints...
      </div>
    );
  if (!assignedComplaints.length)
    return (
      <div className="flex h-96 items-center justify-center text-gray-400">
        No assigned complaints.
      </div>
    );

  return (
    <div className="w-full flex flex-1 min-h-0 bg-transparent rounded-xl shadow-xl overflow-hidden border border-slate-800 h-[600px]">
      {/* Sidebar */}
      <aside className="w-60 bg-[#192338] border-r border-slate-800 flex flex-col py-3 px-2 gap-2 min-h-0">
        <h2 className="text-base font-bold text-white mb-1 pl-1 tracking-tight">
          Assigned Complaints
        </h2>
        <ul className="flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-0">
          {assignedComplaints.map((c) => (
            <li key={c._id} className="mb-1">
              <button
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition font-medium text-[13px]
                  ${
                    selectedId === c._id
                      ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow"
                      : "bg-[#202c44] hover:bg-blue-500 hover:text-white text-slate-300"
                  }`}
                onClick={() => setSelectedId(c._id)}
              >
                <span className="font-mono text-[11px] bg-slate-900 px-1.5 py-0.5 rounded mr-1">
                  {c._id.slice(-6)}
                </span>
                <span className="truncate">
                  {c.subject || (
                    <em className="italic text-slate-400">No subject</em>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat Section */}
      {/* Chat Section */}
      <section className="flex-1 flex flex-col min-h-0 p-4">
        <div className="flex flex-col h-full min-h-0 w-full mx-auto bg-gradient-to-br from-[#232c3d] via-[#202a40] to-[#1a2235] rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#171f30] via-[#1b273a] to-[#22334c] px-6 py-4 border-b border-slate-800 flex-shrink-0">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 font-bold text-white text-[15px] shadow-md border-2 border-white">
              {getInitials(user?.name, "U")}
            </div>
            <div>
              <div className="font-semibold text-[16px] text-white tracking-wide leading-none">
                Chat with User
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-none">
                <span className="font-semibold text-white">
                  {selectedComplaint?.subject}
                </span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {selectedComplaint?.assignedTo && (
                <ComplaintStatusDropdown
                  status={selectedComplaint.status}
                  complaintId={selectedComplaint._id}
                  onStatusChange={(newStatus) => {
                    // Optionally, immediately unselect if not active
                    if (newStatus === "Resolved" || newStatus === "Closed") {
                      setSelectedId(null);
                    }
                  }}
                />
              )}
            </div>
          </div>
          {/* MESSAGES (SCROLLABLE) */}
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 flex flex-col gap-2 custom-scrollbar bg-transparent">
            {selectedComplaint ? (
              <ComplaintChat
                complaintId={selectedComplaint._id}
                currentUser={user}
              />
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-slate-400">
                  Select a complaint to view messages.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// ---- Chat Bubbles and Message List ----
function ComplaintChat({ complaintId, currentUser }) {
  const chatEndRef = useRef(null);

  // Use polling for real-time updates (every 5s)
  const { data: complaint, isLoading } = useComplaintWithPolling(
    complaintId,
    5000
  );

  // Mutation hook for sending a message (admin/mod)
  const sendMessage = useAdminComplaintMessage(complaintId);

  const [message, setMessage] = useState("");

  const messages = buildMessages(complaint);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isLoading]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || sendMessage.isLoading) return;
    await sendMessage.mutateAsync(message);
    setMessage("");
    // Message will appear automatically after polling interval or if the mutation triggers an invalidation
  };

  if (isLoading || !complaint)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Loading chat...
      </div>
    );

  return (
    <div className="flex flex-col h-full min-h-0 relative">
      {/* MESSAGES */}
      <div className="flex-1 flex flex-col gap-2 min-h-0 overflow-y-auto pb-2">
        {messages.length === 0 && (
          <p className="text-gray-400 text-xs text-center mt-10">
            No messages yet.
          </p>
        )}
        {messages.map((msg, idx) => {
          // Correct "You"/role display
          const isMe =
            (msg.role === currentUser?.role &&
              msg.sender === currentUser?.id) ||
            (msg.role === "admin" && currentUser?.role === "admin") ||
            (msg.role === "moderator" && currentUser?.role === "moderator");
          const { name: roleName, initials } = getRoleInfo(msg.role);

          return (
            <div
              key={idx}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar/initials */}
              {!isMe && (
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-700 to-cyan-400 flex items-center justify-center font-bold text-white text-xs shadow border-2 border-white">
                    {initials}
                  </div>
                </div>
              )}
              <div
                className={`
    px-4 py-2.5 
    rounded-[22px]
    max-w-[90%] sm:max-w-[75%] md:max-w-[60%] lg:max-w-[50%]
    break-words
    shadow-md
    text-[14px]
    ${
      isMe
        ? "bg-gradient-to-br from-blue-400 to-cyan-400 text-white rounded-br-lg"
        : "bg-white text-gray-900 rounded-bl-lg"
    }
    transition
  `}
              >
                <div className="text-[11px] mb-1 opacity-60 flex items-center gap-1">
                  <span>{isMe ? "You" : roleName}</span>
                  <span className="mx-1">•</span>
                  <span>
                    {msg.sentAt
                      ? new Date(msg.sentAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
                <div className="whitespace-pre-wrap break-words break-all leading-tight">
                  {msg.message}
                </div>
              </div>
              {isMe && (
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-700 to-cyan-400 flex items-center justify-center font-bold text-white text-xs shadow border-2 border-white">
                    {getInitials(currentUser?.name, initials)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>
      {/* Sticky chat input */}
      <form
        className="flex gap-2 p-4 border-t border-slate-800 bg-slate-900/95 rounded-b-xl shadow-inner"
        onSubmit={handleSend}
        autoComplete="off"
      >
        <input
          className="flex-1 px-4 py-3 rounded-lg bg-[#263149] text-white focus:outline-none focus:ring-2 focus:ring-sky-400/80 transition shadow-md"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message…"
          disabled={sendMessage.isLoading}
          maxLength={1000}
        />
        <button
          className="bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-700 px-6 py-3 rounded-lg text-white font-semibold shadow-lg border border-blue-400/50 transition"
          type="submit"
          disabled={sendMessage.isLoading}
        >
          {sendMessage.isLoading ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}
