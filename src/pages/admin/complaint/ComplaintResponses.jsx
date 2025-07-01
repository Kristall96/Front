import { useComplaints } from "./hooks/useComplaint";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import secureAxios from "../../../utils/secureAxios";

// Helper to get initials
const getInitials = (name, fallback = "U") =>
  (name || fallback)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
    (c) => c.assignedTo && c.assignedTo._id === user?._id
  );
  const [selectedId, setSelectedId] = useState(
    assignedComplaints[0]?._id || null
  );

  // ✅ MOVE HOOK TO THE TOP
  const [refreshKey, setRefreshKey] = useState(0); // force ComplaintChat rerender on send

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

  // Message sending handler moved up here to pass to input
  const handleSendMessage = async (
    complaintId,
    message,
    resetInput,
    setSending
  ) => {
    setSending(true);
    try {
      await secureAxios.post(`/admin/complaints/${complaintId}/message`, {
        message,
      });
      resetInput();
      setRefreshKey((k) => k + 1); // trigger reload
    } catch (err) {
      alert(
        err.response?.data?.error || "Failed to send message. Please try again."
      );
    }
    setSending(false);
  };

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
          </div>
          {/* MESSAGES (SCROLLABLE) */}
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 flex flex-col gap-2 custom-scrollbar bg-transparent">
            {selectedComplaint ? (
              <ComplaintChat
                complaintId={selectedComplaint._id}
                currentUser={user}
                refreshKey={refreshKey}
              />
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-slate-400">
                  Select a complaint to view messages.
                </p>
              </div>
            )}
          </div>
          {/* Chat Input - OUTSIDE/BELOW messages */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#171f30] via-[#1b273a] to-[#22334c] px-6 py-4 border-b border-slate-800 flex-shrink-0">
            {" "}
            {selectedComplaint && (
              <ChatInput
                complaintId={selectedComplaint._id}
                onSend={handleSendMessage}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// ---- Chat Bubbles and Message List ----
function ComplaintChat({ complaintId, currentUser, refreshKey }) {
  const [complaint, setComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Fetch complaint (and messages) by ID
  const fetchComplaintById = async (id) => {
    setLoading(true);
    try {
      const { data } = await secureAxios.get(`/admin/complaints/${id}`);
      setComplaint(data);
      setMessages(buildMessages(data));
    } catch {
      setComplaint(null);
      setMessages([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (complaintId) fetchComplaintById(complaintId);
    // eslint-disable-next-line
  }, [complaintId, refreshKey]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, loading]);

  if (!complaint)
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
          const isAdmin = msg.role === "admin";
          const name = isAdmin ? currentUser?.name || "You" : "Customer";
          return (
            <div
              key={idx}
              className={`flex items-end gap-2 ${
                isAdmin ? "justify-end" : "justify-start"
              }`}
            >
              {!isAdmin && (
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-700 to-cyan-400 flex items-center justify-center font-bold text-white text-xs shadow border-2 border-white">
                    {getInitials(name)}
                  </div>
                </div>
              )}
              <div
                className={`
                  px-4 py-2.5 
                  rounded-[22px]
                  max-w-[68%]
                  break-words
                  shadow-md
                  text-[14px]
                  ${
                    isAdmin
                      ? "bg-gradient-to-br from-blue-400 to-cyan-400 text-white rounded-br-lg"
                      : "bg-white text-gray-900 rounded-bl-lg"
                  }
                  transition
                  `}
              >
                <div className="text-[11px] mb-1 opacity-60 flex items-center gap-1">
                  <span>{name}</span>
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
                <div className="whitespace-pre-wrap break-words max-h-28 overflow-y-auto pr-1">
                  {msg.message}
                </div>
              </div>
              {isAdmin && (
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-700 to-cyan-400 flex items-center justify-center font-bold text-white text-xs shadow border-2 border-white">
                    {getInitials(currentUser?.name, "A")}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

// ---- Modern Chat Input Field (OUTSIDE chat scroll) ----
function ChatInput({ complaintId, onSend }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const resetInput = () => setMessage("");
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;
    await onSend(complaintId, message, resetInput, setSending);
  };

  return (
    <form
      className="w-full flex justify-center items-end"
      onSubmit={handleSend}
      autoComplete="off"
      style={{ margin: 0, padding: 0 }}
    >
      <div className="relative w-full max-w-xl flex justify-center">
        {/* Outer Glow Bubble */}
        <div
          className="absolute -inset-[2px] rounded-2xl z-0 pointer-events-none
      bg-gradient-to-tr from-cyan-400/50 via-blue-700/40 to-purple-700/30
      blur-md animate-pulse"
          aria-hidden="true"
        />

        {/* Chat bar */}
        <div
          className="
      relative flex flex-row items-end gap-2 w-full
      bg-gradient-to-br from-[#202a3a]/95 via-[#192338]/90 to-[#181f2c]/90
      border border-blue-900/60
      rounded-2xl shadow-[0_1px_8px_0_rgba(0,20,40,0.09)]
      px-3 py-1
      z-10
      backdrop-blur-md
      focus-within:ring-2 focus-within:ring-cyan-400/60
      transition
    "
        >
          <textarea
            className="
          flex-1 w-full
          bg-transparent outline-none border-none
          text-slate-200 placeholder-cyan-100
          text-[15px] resize-none
          px-3 py-2
          min-h-[36px] max-h-[68px]
          rounded-xl
          overflow-y-auto
          focus:bg-[#232c3d]/95
          transition duration-150
          scrollbar-thin scrollbar-thumb-[#253051] scrollbar-track-transparent
        "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your response…"
            disabled={sending}
            rows={1}
            style={{
              // Ensure text is never flush with border
              boxSizing: "border-box",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />

          <button
            className="
          px-6 py-2
          rounded-xl font-bold
          bg-gradient-to-br from-blue-500 to-cyan-500
          text-white shadow
          border border-cyan-400/30
          hover:from-cyan-400 hover:to-blue-400 hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-cyan-400/50
          transition duration-150
          flex items-center gap-1
          text-[15px]
          active:scale-95
        "
            type="submit"
            disabled={sending}
            style={{ alignSelf: "center", height: "40px" }}
          >
            {sending ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : (
              <>
                Send
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14m0 0l-5-5m5 5l-5 5"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
