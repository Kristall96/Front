// components/CheckEmailStep.jsx
import { useState } from "react";
import secureAxios from "../utils/secureAxios";

const CheckEmailStep = ({ email, setEmail, setStep }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await secureAxios.get(
        `/auth/check-email?email=${encodeURIComponent(email)}`
      );

      if (res.data.exists) {
        setStep("login"); // Go to login form if email exists
      } else {
        setStep("register"); // Go to register form if not
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong checking the email.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCheck} className="w-full">
      <h2 className="text-xl font-semibold mb-4">Enter your email</h2>
      <input
        type="email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        placeholder="you@example.com"
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Checking..." : "Continue"}
      </button>
    </form>
  );
};

export default CheckEmailStep;
