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
        setStep("login");
      } else {
        setStep("register");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong checking the email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleCheck}
      className="w-full bg-neutral-900 text-gray-100 p-6 rounded-xl shadow-lg space-y-4"
    >
      <h2 className="text-xl font-bold">Enter your email</h2>

      <input
        type="email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 rounded-md bg-neutral-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="you@example.com"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-md font-medium transition ${
          loading
            ? "bg-blue-800 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white`}
      >
        {loading ? "Checking..." : "Continue"}
      </button>
    </form>
  );
};

export default CheckEmailStep;
