import { useState } from "react";
import { useCreateComplaint } from "../complaint/hooks/useComplaint"; // Update path if needed

export default function NewComplaintForm() {
  const [form, setForm] = useState({
    subject: "",
    category: "order issue",
    description: "",
  });

  const [success, setSuccess] = useState("");
  const categories = ["order issue", "payment", "product", "delivery", "other"];

  // Use the mutation hook
  const createComplaint = useCreateComplaint();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    createComplaint.mutate(form, {
      onSuccess: () => {
        setSuccess("Complaint submitted successfully!");
        setForm({ subject: "", category: "order issue", description: "" });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <h2 className="text-2xl font-semibold">Raise a Complaint</h2>

      <div>
        <label className="block text-sm font-medium">Subject</label>
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
          className="w-full p-2 bg-[#1e293b] rounded text-white"
          placeholder="Short summary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 bg-[#1e293b] rounded text-white"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={5}
          className="w-full p-2 bg-[#1e293b] rounded text-white"
          placeholder="Describe your complaint…"
        />
      </div>

      {createComplaint.isError && (
        <p className="text-red-500">
          {createComplaint.error?.response?.data?.message ||
            createComplaint.error?.message}
        </p>
      )}
      {success && <p className="text-green-500">{success}</p>}

      <button
        type="submit"
        disabled={createComplaint.isLoading}
        className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
      >
        {createComplaint.isLoading ? "Submitting…" : "Submit Complaint"}
      </button>
    </form>
  );
}
