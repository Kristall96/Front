import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import secureAxios from "../utils/secureAxios";

const ResetPasswordForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRequest = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await secureAxios.post("/auth/reset-password", { email });
      setMessage("If this email exists, a reset link has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request reset.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await secureAxios.post("/auth/reset", {
        token,
        newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => {
        onClose();
        navigate("/login");
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={token ? handleReset : handleRequest}
      className="space-y-4 bg-neutral-900 text-gray-100 p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-xl font-bold mb-2">
        {token ? "Reset Password" : "Forgot your password?"}
      </h2>

      {!token ? (
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-neutral-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      ) : (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-neutral-800 border border-gray-700"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-neutral-800 border border-gray-700"
            required
          />
        </>
      )}

      {message && <p className="text-green-500 text-sm">{message}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-md font-medium text-white transition ${
          loading
            ? "bg-blue-800 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading
          ? token
            ? "Resetting..."
            : "Sending..."
          : token
          ? "Reset Password"
          : "Send Reset Link"}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
