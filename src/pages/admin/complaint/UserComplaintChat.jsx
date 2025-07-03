import { useRef, useState, useEffect } from "react";
import secureAxios from "../../../utils/secureAxios";
import { useAuth } from "../../../context/AuthContext";
import { useUserComplaintWithPolling } from "../../admin/complaint/hooks/useComplaint";

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

export default function UserComplaintChat({ complaintId }) {
  const { user } = useAuth();
  const chatEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // 👉 Use the polling hook (but turn off built-in polling):
  const {
    data: complaint,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserComplaintWithPolling(complaintId, false);

  // Add your custom polling here:
  useEffect(() => {
    if (!complaintId) return;
    const interval = setInterval(() => {
      refetch();
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [complaintId, refetch]);

  const messages = buildMessages(complaint);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isLoading]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;
    setSending(true);
    try {
      await secureAxios.post(`/complaint/${complaintId}/message`, { message });
      setMessage("");
      refetch(); // Instantly refresh messages after sending
    } catch (err) {
      alert(
        err.response?.data?.error || "Failed to send message. Please try again."
      );
    }
    setSending(false);
  };

  // Error state
  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400">
        {error?.message || "Could not load complaint."}
      </div>
    );
  }

  // Loading or empty state
  if (isLoading || !complaint) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Chat Header */}
      <div className="border-b border-slate-800 px-6 py-3 bg-slate-900 rounded-t-xl">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold text-white">
            {complaint.subject}
          </span>
          <span
            className={`
              text-xs px-2 py-1 rounded 
              ${
                complaint.status === "Resolved"
                  ? "bg-green-800 text-green-300"
                  : complaint.status === "Open"
                  ? "bg-yellow-800 text-yellow-200"
                  : "bg-blue-900 text-blue-200"
              }
            `}
          >
            {complaint.status}
          </span>
          <span className="ml-auto text-xs text-slate-400">
            {new Date(complaint.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      {/* Messages */}
      <div
        className="flex-1 flex flex-col gap-2 px-4 py-6 overflow-y-auto custom-scrollbar"
        style={{
          minHeight: 0,
          scrollbarWidth: "thin", // Firefox support
          scrollbarColor: "#4b5563 #141a29", // Firefox support
          WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
          msOverflowStyle: "-ms-autohiding-scrollbar", // Hide scrollbar in IE
        }}
      >
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-16">
            No messages yet.
          </p>
        )}
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          const name = isUser
            ? user?.name || "You"
            : msg.role === "admin"
            ? "Admin"
            : "Moderator";
          const gradient =
            "bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400";
          return (
            <div
              key={idx}
              className={`flex items-end gap-2 mb-2 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center font-semibold text-white text-xs shadow border-2 border-blue-300">
                    {getInitials(name)}
                  </div>
                </div>
              )}
              <div
                className={`
                  px-4 py-2.5 rounded-[22px] max-w-[90%] sm:max-w-[75%] md:max-w-[60%] lg:max-w-[50%] break-words shadow-md text-[14px]
                  ${
                    isUser
                      ? "bg-slate-200/90 text-gray-900 rounded-tr-md border border-slate-400/20"
                      : `${gradient} text-white rounded-tl-md border border-blue-500/40`
                  } transition
                `}
              >
                <div className="text-xs mb-1 opacity-80 flex items-center gap-1 font-mono tracking-tight">
                  <span>{isUser ? "You" : name}</span>
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
              {isUser && (
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center font-semibold text-white text-xs shadow border-2 border-sky-200">
                    {getInitials(user?.name, "U")}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>
      {/* Sticky input at bottom */}
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
          disabled={sending}
          maxLength={1000}
        />
        <button
          className="bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-700 px-6 py-3 rounded-lg text-white font-semibold shadow-lg border border-blue-400/50 transition"
          type="submit"
          disabled={sending}
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}
