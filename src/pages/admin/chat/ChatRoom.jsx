import React, { useState } from "react";

export default function ChatRoom({ user, roomId, messages, sendMessage }) {
  const [input, setInput] = useState(""); // For the message input field

  // Handle sending message when the form is submitted
  const SendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(roomId, input); // Send the message
      setInput(""); // Clear input field after sending
    }
  };

  // Format the timestamp in a user-friendly way
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-800 rounded-xl overflow-hidden shadow-lg">
      {/* Message display section */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.sender && msg.sender.id === user.id
                  ? "items-end"
                  : "items-start"
              }`}
            >
              {/* Check if sender exists before accessing sender's data */}
              <div className="text-sm text-gray-400">
                <strong>
                  {msg.sender ? msg.sender.fullName : "Unknown Sender"}
                </strong>
              </div>
              <div
                className={`message-text max-w-xl p-3 rounded-lg mt-1 ${
                  msg.sender && msg.sender.id === user.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                <p>{msg.text}</p> {/* Message text */}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                <span>{formatTimestamp(msg.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message input section */}
      <form
        onSubmit={SendMessage}
        className="flex p-3 border-t border-slate-700 bg-slate-900 rounded-lg bg-opacity-60 backdrop-blur-xl"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:outline-none bg-opacity-70"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="ml-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
