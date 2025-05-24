import { useState } from "react";
import { useAuth } from "../context/AuthContext";
const LoginForm = ({
  email,
  onSuccess,
  onSwitchToRegister,
  onForgotPassword,
}) => {
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
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-neutral-900 text-gray-100 p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-xl font-bold">Welcome back</h2>
      <p className="text-sm text-gray-400 mb-2">{email}</p>

      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2 rounded-md bg-neutral-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-md font-medium transition ${
          loading
            ? "bg-blue-800 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="flex flex-col gap-2 text-sm mt-2">
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Not your account? Create a new one
        </button>

        <button
          type="button"
          onClick={onForgotPassword}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
