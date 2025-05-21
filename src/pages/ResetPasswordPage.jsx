// ✅ Frontend Reset Password Page (React + Vite + Axios)

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import secureAxios from "../utils/secureAxios";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }
    try {
      const res = await secureAxios.post("/auth/reset", {
        token,
        newPassword,
      });
      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("❌ Reset error:", err.response || err.message); // 👈 log it clearly
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded">
      <h1 className="text-xl font-semibold mb-4">Reset Your Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
