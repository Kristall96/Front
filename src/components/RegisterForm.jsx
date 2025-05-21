// ✅ Updated RegisterForm.jsx to use secureAxios and avoid hardcoded localhost
import { useState } from "react";
import secureAxios from "../utils/secureAxios"; // 👈 uses VITE_API_URL

const RegisterForm = ({ email, onSuccess, onSwitchToLogin }) => {
  const [form, setForm] = useState({
    username: "",
    email: email || "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await secureAxios.post("/auth/register", form); // ✅ uses baseURL + credentials
      setMessage(res.data.message); // e.g. "Check your email..."
      onSuccess?.(); // Optional callback
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-lg font-semibold">Create an account</h2>
      <p className="text-sm text-gray-600">{form.email}</p>

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      {message && <p className="text-green-600 text-sm">{message}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>

      <button
        type="button"
        onClick={onSwitchToLogin}
        className="text-sm text-blue-600 underline mt-2"
      >
        Already have an account? Login
      </button>
    </form>
  );
};

export default RegisterForm;
