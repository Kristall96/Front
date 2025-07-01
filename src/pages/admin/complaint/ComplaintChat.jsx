import { useEffect, useState, useRef } from "react";
import secureAxios from "../../../utils/secureAxios";

// Helper: Get initials from user or fallback
const getInitials = (name, fallback = "U") => {
  if (!name) return fallback;
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

// Helper: Always returns description as first message, then all DB messages
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

export default function ComplaintChat({ complaintId, currentUser }) {
  const [complaint, setComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Fetch complaint (and messages) by ID and always build visual messages array
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
  }, [complaintId]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, loading]);

  // Send message to API, then refetch and rebuild chat
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;
    setSending(true);
    try {
      await secureAxios.post(`/admin/complaints/${complaintId}/message`, {
        message,
      });
      setMessage("");
      await fetchComplaintById(complaintId); // Rebuilds with description first
    } catch (err) {
      alert(
        err.response?.data?.error || "Failed to send message. Please try again."
      );
    }
    setSending(false);
  };

  if (!complaint)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Loading chat...
      </div>
    );

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 flex flex-col gap-4 mb-2 min-h-0">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-16">
            No messages yet.
          </p>
        )}

        {messages.map((msg, idx) => {
          const isAdmin = msg.role === "admin";
          const name = isAdmin ? currentUser?.name || "You" : "Customer";
          // Gradient for admin
          const gradient =
            "bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400";
          return (
            <div
              key={idx}
              className={`flex items-end gap-2 ${
                isAdmin ? "justify-end" : "justify-start"
              }`}
            >
              {!isAdmin && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center font-semibold text-white text-sm shadow-lg border-2 border-blue-300">
                    {getInitials(name)}
                  </div>
                </div>
              )}
              <div
                className={`
                  rounded-2xl px-5 py-3 shadow-xl transition-all
                  max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl break-words
                  text-base
                  ${
                    isAdmin
                      ? `${gradient} text-white rounded-tr-sm border border-blue-500/40`
                      : "bg-slate-200/90 text-gray-900 rounded-tl-sm border border-slate-400/20"
                  }
                `}
                style={{
                  boxShadow: isAdmin
                    ? "0 2px 18px 0 rgba(0,207,255,0.20)"
                    : "0 2px 12px 0 rgba(0,20,40,0.09)",
                }}
              >
                <div className="text-xs mb-1 opacity-80 flex items-center gap-1 font-mono tracking-tight">
                  <span>{isAdmin ? "You" : "Customer"}</span>
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
                <div className="whitespace-pre-wrap break-words leading-tight">
                  {msg.message}
                </div>
              </div>
              {isAdmin && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center font-semibold text-white text-sm shadow-lg border-2 border-sky-200">
                    {getInitials(currentUser?.name, "A")}
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
        className="flex gap-2 mt-2 pt-2 border-t border-slate-700 bg-slate-900/95 rounded-b-xl shadow-inner"
        onSubmit={handleSend}
        autoComplete="off"
      >
        <input
          className="flex-1 px-4 py-3 rounded-lg bg-[#263149] text-white focus:outline-none focus:ring-2 focus:ring-sky-400/80 transition shadow-md"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your response…"
          disabled={sending}
          maxLength={1000}
        />
        <button
          className="bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-700 px-8 py-3 rounded-lg text-white font-semibold shadow-lg border border-blue-400/50 transition"
          type="submit"
          disabled={sending}
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}
