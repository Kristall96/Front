// src/pages/dashboard/sections/ProfileSection.jsx
import { useState } from "react";
import secureAxios from "../../../utils/secureAxios";

const ProfileSection = ({ user, refreshUser }) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await secureAxios.put("/users/me", formData);
      setMessage("✅ Profile updated successfully!");
      refreshUser?.();
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Failed to update profile.";
      setMessage(msg);
    }
  };

  return (
    <div className="max-w-xl bg-white p-8 rounded-2xl shadow-lg border">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Edit Your Profile
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition"
        >
          Save Changes
        </button>
        {message && (
          <p className="text-sm mt-2 text-green-600 font-medium">{message}</p>
        )}
      </form>
    </div>
  );
};

export default ProfileSection;
