// src/components/LoginForm.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginForm = ({ email, onSuccess, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      onSuccess?.(); // ✅ This should be closing modal and redirecting
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-lg font-semibold">Welcome back</h2>
      <p className="text-sm text-gray-600">{email}</p>

      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <button
        type="button"
        onClick={onSwitchToRegister}
        className="text-sm text-blue-600 underline mt-2"
      >
        Not your account? Create a new one
      </button>
    </form>
  );
};

export default LoginForm;
