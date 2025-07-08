import React from "react";

export default function ChatRoomList({ rooms, currentRoom, joinRoom }) {
  return (
    <aside className="w-72 p-6  backdrop-blur-xl border-r border-gray-800 flex flex-col rounded-lg shadow-lg">
      <ul className="space-y-4">
        {rooms.map((room) => (
          <li key={room._id}>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg flex justify-between items-center transition-all ${
                room._id === currentRoom
                  ? "bg-white/20 text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => {
                joinRoom(room._id); // Join the selected room
              }}
            >
              <span className="font-medium">#{room.name}</span>
              {room._id === currentRoom && (
                <span className="text-xs text-blue-100">Active</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
