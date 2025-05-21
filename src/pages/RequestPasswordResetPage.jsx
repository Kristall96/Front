// pages/RequestPasswordResetPage.jsx
import { useState } from "react";
import secureAxios from "../utils/secureAxios";

const RequestPasswordResetPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await secureAxios.post("/auth/reset-password", { email });
      setMessage("If this email exists, a reset link has been sent.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to request password reset."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-xl font-semibold mb-4">Forgot your password?</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        {message && <p className="text-green-600 mb-2">{message}</p>}
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default RequestPasswordResetPage;
