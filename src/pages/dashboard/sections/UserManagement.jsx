import { useEffect, useState } from "react";
import secureAxios from "../../../utils/secureAxios";
import { Pencil, Save, X } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await secureAxios.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError(
        "Failed to load users",
        err.response?.data?.message || "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditForm({ ...user });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await secureAxios.put(
        `/admin/users/${selectedUser._id}`,
        editForm
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === selectedUser._id ? res.data.user : u))
      );
      setSelectedUser(null);
    } catch (err) {
      alert(
        "❌ Failed to update user",
        err.response?.data?.message || "Unknown error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#131a25] p-6 rounded-xl shadow-md space-y-8 border border-gray-700 text-white">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        👤 User Management
      </h2>

      {loading ? (
        <p className="text-gray-300">Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-[#1b2431] rounded-md">
            <thead className="bg-[#2a3444] text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-gray-600">
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                  <td className="px-4 py-2">
                    <button
                      className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                      onClick={() => handleEditClick(user)}
                    >
                      <Pencil size={16} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <div className="bg-[#1b2431] p-6 border border-gray-600 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            Edit: {selectedUser.username}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="username"
              value={editForm.username || ""}
              onChange={handleFormChange}
              placeholder="Username"
              className="px-4 py-2 rounded-md bg-[#2a3444] border border-gray-600 focus:outline-none"
            />
            <input
              name="email"
              value={editForm.email || ""}
              onChange={handleFormChange}
              placeholder="Email"
              className="px-4 py-2 rounded-md bg-[#2a3444] border border-gray-600 focus:outline-none"
            />
            <select
              name="role"
              value={editForm.role || "user"}
              onChange={handleFormChange}
              className="px-4 py-2 rounded-md bg-[#2a3444] border border-gray-600 focus:outline-none"
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
            <select
              name="badge"
              value={editForm.badge || "None"}
              onChange={handleFormChange}
              className="px-4 py-2 rounded-md bg-[#2a3444] border border-gray-600 focus:outline-none"
            >
              <option>None</option>
              <option>Bronze</option>
              <option>Silver</option>
              <option>Gold</option>
              <option>VIP</option>
              <option>Loyalist</option>
              <option>Supporter</option>
              <option>Beta Tester</option>
              <option>Top Reviewer</option>
            </select>
          </div>
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => setSelectedUser(null)}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
