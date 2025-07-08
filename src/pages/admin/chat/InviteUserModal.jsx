// src/pages/admin/chat/InviteUserModal.jsx
import { useEffect, useState } from "react";
import secureAxios from "../../../utils/secureAxios";
export default function InviteUserModal({ roomId, onClose, onInvited }) {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");
  useEffect(() => {
    secureAxios
      .get("/admin/users?role=moderator") // Or your endpoint for listing moderators
      .then((res) => setUsers(res.data));
  }, []);
  const invite = async () => {
    await secureAxios.post(`/admin/chat/rooms/${roomId}/members`, {
      userId: selected,
    });
    if (onInvited) onInvited(selected);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow text-black space-y-4 w-80">
        <b>Invite Moderator</b>
        <select
          className="border w-full p-2"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Select moderator...</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.firstName} {u.lastName} ({u.username})
            </option>
          ))}
        </select>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="text-gray-600">
            Cancel
          </button>
          <button
            disabled={!selected}
            onClick={invite}
            className="bg-blue-700 px-3 py-1 rounded text-white"
          >
            Invite
          </button>
        </div>
      </div>
    </div>
  );
}
