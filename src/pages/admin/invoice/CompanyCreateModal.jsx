// components/admin/invoice/CompanyCreateModal.jsx
import { useState } from "react";
import secureAxios from "../../../utils/secureAxios";

const initialState = {
  name: "",
  vatNumber: "",
  address: "",
  email: "",
  phone: "",
  country: "",
  website: "",
  notes: "",
};

const CompanyCreateModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await secureAxios.post("/companies", form);
      onSaved();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          err.message ||
          "Failed to create company"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#23263a] text-white p-6 rounded-lg shadow-xl space-y-4"
      >
        <h2 className="text-xl font-bold mb-2">+ New Company</h2>
        {error && <div className="text-red-400 mb-2 text-sm">{error}</div>}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Company Name *"
          required
          className="bg-[#252a3a] border border-gray-600 p-2 rounded w-full"
        />
        <input
          name="vatNumber"
          value={form.vatNumber}
          onChange={handleChange}
          placeholder="VAT Number"
          className="bg-[#252a3a] border border-gray-600 p-2 rounded w-full"
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="bg-[#252a3a] border border-gray-600 p-2 rounded w-full"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="bg-[#252a3a] border border-gray-600 p-2 rounded w-full"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="bg-[#252a3a] border border-gray-600 p-2 rounded w-full"
        />
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country"
          className="bg-[#252a3a] border border-gray-600 p-2 rounded w-full"
        />
        <input
          name="website"
          value={form.website}
          onChange={handleChange}
          placeholder="Website"
          type="url"
          className="bg-[#252a3a] border border-gray-600 p-2 rounded w-full"
        />
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="bg-[#252a3a] border border-gray-600 p-2 rounded w-full min-h-[50px]"
        />
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-700"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyCreateModal;
