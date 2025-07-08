import React, { useState, useEffect } from "react";
import useChatSocket from "./useChatSocket";
import ChatRoomList from "./ChatRoomList";
import ChatRoom from "./ChatRoom";
import InviteUserModal from "./InviteUserModal";
import { useAuth } from "../../../context/AuthContext";
import secureAxios from "../../../utils/secureAxios";

export default function ChatDashboard() {
  const { user } = useAuth();
  const { rooms, currentRoom, messages, joinRoom, sendMessage, refreshRooms } =
    useChatSocket(user);

  const [showInvite, setShowInvite] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newRoomData, setNewRoomData] = useState({ name: "", type: "channel" });
  const [creating, setCreating] = useState(false);

  const selectedRoom = rooms.find((r) => r._id === currentRoom);

  useEffect(() => {
    if (rooms.length > 0 && !currentRoom) {
      // Only join the first room if none is selected already
      joinRoom(rooms[0]._id);
    }
  }, [rooms, currentRoom, joinRoom]); // Make sure joinRoom doesn't trigger multiple times

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomData.name.trim()) return;
    setCreating(true);
    try {
      const res = await secureAxios.post("/admin/chat/rooms", {
        name: newRoomData.name,
        type: newRoomData.type,
        members: [],
        isReadOnly: false,
        isPublic: false,
      });
      setShowCreate(false);
      setNewRoomData({ name: "", type: "channel" });
      refreshRooms();
      setTimeout(() => joinRoom(res.data._id), 400); // Ensure the new room is joined after it is created
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex h-full bg-gray-900">
      {/* Sidebar with channels */}
      <div className="w-80 p-6 border-r border-gray-800 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-lg font-semibold">Channels & DMs</h3>
          <button
            className="bg-blue-600 px-4 py-2 rounded-lg text-sm text-white hover:bg-blue-700 transition"
            onClick={() => setShowCreate(true)}
          >
            + New Room
          </button>
        </div>
        <ChatRoomList
          rooms={rooms}
          currentRoom={currentRoom}
          joinRoom={joinRoom}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-gray-800 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-900">
          {selectedRoom ? (
            <>
              <span className="font-bold text-lg text-white">
                #{selectedRoom.name}
              </span>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded text-xs hover:bg-blue-700 transition"
                onClick={() => setShowInvite(true)}
              >
                Invite Moderator
              </button>
            </>
          ) : (
            <span className="text-gray-400">Select a chat room to begin.</span>
          )}
        </div>
        {selectedRoom ? (
          <ChatRoom
            user={user}
            roomId={selectedRoom._id}
            messages={messages[selectedRoom._id] || []}
            sendMessage={sendMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a chat room to begin.
          </div>
        )}

        {/* Invite Modal */}
        {showInvite && selectedRoom && (
          <InviteUserModal
            roomId={selectedRoom._id}
            onClose={() => setShowInvite(false)}
            onInvited={() => {}}
          />
        )}

        {/* Create Room Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form
              className="bg-white text-black p-8 rounded-xl shadow-xl space-y-4 w-96"
              onSubmit={handleCreateRoom}
            >
              <h3 className="font-semibold text-xl mb-4">Create Room</h3>
              <input
                className="border p-4 rounded-lg w-full bg-gray-100 focus:ring-2 focus:ring-blue-600"
                placeholder="Room name"
                value={newRoomData.name}
                onChange={(e) =>
                  setNewRoomData({ ...newRoomData, name: e.target.value })
                }
                autoFocus
                disabled={creating}
              />
              <select
                value={newRoomData.type}
                onChange={(e) =>
                  setNewRoomData({ ...newRoomData, type: e.target.value })
                }
                className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-600"
                disabled={creating}
              >
                <option value="channel">Channel</option>
                <option value="group">Group</option>
                <option value="dm">Direct Message</option>
              </select>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowCreate(false)}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 px-6 py-3 rounded-lg text-white"
                  disabled={creating || !newRoomData.name.trim()}
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
