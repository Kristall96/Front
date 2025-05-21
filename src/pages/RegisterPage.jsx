// pages/RegisterPage.jsx
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form,
        {
          withCredentials: true,
        }
      );
      setMessage(res.data.message); // ✅ This shows "Check your email..."
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          type="email"
        />
        <input
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          type="password"
        />
        <button type="submit">Register</button>
      </form>

      {message && (
        <p style={{ color: "green", marginTop: "10px" }}>{message}</p>
      )}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}
