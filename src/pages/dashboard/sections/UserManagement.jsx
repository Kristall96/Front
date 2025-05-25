// src/pages/dashboard/sections/UserManagement.jsx
import { useEffect, useState } from "react";
import secureAxios from "../../../utils/secureAxios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    fetchUsers();
  }, []);

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
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-black mb-6">User Management</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-sm px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedUser && (
        <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-semibold mb-4">
            Edit User: {selectedUser.username}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="username"
              value={editForm.username || ""}
              onChange={handleFormChange}
              placeholder="Username"
              className="input"
            />
            <input
              name="email"
              value={editForm.email || ""}
              onChange={handleFormChange}
              placeholder="Email"
              className="input"
            />
            <select
              name="role"
              value={editForm.role || "user"}
              onChange={handleFormChange}
              className="input"
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
            <select
              name="badge"
              value={editForm.badge || "None"}
              onChange={handleFormChange}
              className="input"
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
          <div className="mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-5 py-2 text-white rounded-md font-medium transition duration-150 ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-900"
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => setSelectedUser(null)}
              className="ml-4 text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
