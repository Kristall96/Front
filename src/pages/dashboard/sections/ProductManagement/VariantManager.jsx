import { useEffect, useState } from "react";
import secureAxios from "../../../../utils/secureAxios";

const VariantManager = () => {
  const [variants, setVariants] = useState([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVariants = async () => {
    try {
      const res = await secureAxios.get("/admin/variant-categories");
      setVariants(res.data);
    } catch (err) {
      console.error("Failed to load variant categories:", err);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    setError("");
    try {
      await secureAxios.post("/admin/variant-categories", { name: newName });
      setNewName("");
      fetchVariants();
    } catch (err) {
      console.error("Failed to add variant category:", err);
      setError(err?.response?.data?.message || "Add failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, name) => {
    try {
      await secureAxios.put(`/admin/variant-categories/${id}`, { name });
      setEditingId(null);
      fetchVariants();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this variant category?")) return;
    try {
      await secureAxios.delete(`/admin/variant-categories/${id}`);
      fetchVariants();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="bg-[#131a25] p-6 rounded-xl shadow-md space-y-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        🧩 Variant Categories
      </h2>

      {/* Add New Variant */}
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="e.g. Size, Color"
          className="w-full p-2 rounded-md bg-[#1e2633] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "+ Add"}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Variant List */}
      {variants.map((variant) => (
        <div
          key={variant._id}
          className="bg-[#1b2431] rounded-lg p-4 text-white flex justify-between items-center shadow-sm"
        >
          {editingId === variant._id ? (
            <input
              defaultValue={variant.name}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdate(variant._id, e.target.value);
                }
              }}
              className="w-full p-2 rounded-md bg-[#2a3444] text-white border border-gray-600 focus:outline-none mr-4"
            />
          ) : (
            <span className="font-medium">{variant.name}</span>
          )}

          <div className="flex gap-3 ml-4">
            {editingId === variant._id ? (
              <button
                onClick={() => setEditingId(null)}
                className="text-sm text-gray-400 hover:text-red-400"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={() => setEditingId(variant._id)}
                className="text-sm text-blue-400 hover:underline"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => handleDelete(variant._id)}
              className="text-sm text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VariantManager;
