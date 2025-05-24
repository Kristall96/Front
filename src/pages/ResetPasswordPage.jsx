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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await secureAxios.post("/auth/reset", {
        token,
        newPassword,
      });
      setSuccess(res.data.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      console.error("❌ Reset error:", err.response || err.message);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-neutral-900 text-gray-100 p-6 rounded-xl shadow-lg space-y-4"
      >
        <h2 className="text-xl font-bold">Reset Your Password</h2>
        <p className="text-sm text-gray-400">
          Enter your new password below to complete the reset.
        </p>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-md bg-neutral-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-md bg-neutral-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md font-medium transition ${
            loading
              ? "bg-blue-800 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
