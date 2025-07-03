import { useState } from "react";
import { useCreateComplaint } from "../complaint/hooks/useComplaint"; // Update path if needed
import { motion, AnimatePresence } from "framer-motion";

export default function NewComplaintForm() {
  const [form, setForm] = useState({
    subject: "",
    category: "order issue",
    description: "",
  });
  const [success, setSuccess] = useState("");
  const categories = ["order issue", "payment", "product", "delivery", "other"];

  const createComplaint = useCreateComplaint();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    createComplaint.mutate(form, {
      onSuccess: () => {
        setSuccess("✅ Complaint submitted successfully!");
        setForm({ subject: "", category: "order issue", description: "" });
      },
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mt-10 bg-slate-800/90 rounded-2xl shadow-2xl border border-slate-700 px-8 py-7 relative"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.6 }}
    >
      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-full h-2 rounded-t-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-sky-400" />

      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 mt-2 text-center tracking-tight">
        Raise a Complaint
      </h2>

      <div className="mb-3">
        <label className="block text-sm font-semibold text-cyan-200 mb-1">
          Subject
        </label>
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 bg-[#1e293b] rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none text-white transition"
          placeholder="Short summary"
          maxLength={70}
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-semibold text-cyan-200 mb-1">
          Category
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-[#1e293b] rounded-lg border border-slate-700 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-cyan-200 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={5}
          maxLength={1000}
          className="w-full px-3 py-2 bg-[#1e293b] rounded-lg border border-slate-700 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
          placeholder="Describe your complaint…"
        />
        <div className="text-right text-xs text-gray-400 mt-1">
          {form.description.length}/1000
        </div>
      </div>

      <AnimatePresence>
        {createComplaint.isError && (
          <motion.p
            className="text-red-400 mb-2"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {createComplaint.error?.response?.data?.message ||
              createComplaint.error?.message}
          </motion.p>
        )}
        {success && (
          <motion.p
            className="text-green-400 mb-2"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {success}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={createComplaint.isLoading}
        className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg shadow-lg transition disabled:opacity-60"
      >
        {createComplaint.isLoading ? "Submitting…" : "Submit Complaint"}
      </button>
    </motion.form>
  );
}
