import { useEffect, useState } from "react";
import secureAxios from "../../../../utils/secureAxios";
import { Plus } from "lucide-react";

const VariantManager = () => {
  const [variants, setVariants] = useState([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    fetchVariants();
  }, []);

  const fetchVariants = async () => {
    try {
      const res = await secureAxios.get("/admin/variant-categories");
      setVariants(res.data);
    } catch (err) {
      console.error("Failed to load variant categories:", err);
    }
  };

  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    setError("");
    setFieldError("");

    const slug = generateSlug(newName);

    try {
      await secureAxios.post("/admin/variant-categories", {
        name: newName,
        slug,
      });
      setNewName("");
      fetchVariants();
    } catch (err) {
      const res = err?.response?.data;
      setError(res?.error || "Add failed");
      setFieldError(res?.details?.name || "");
      console.error("Failed to add variant category:", res);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, name) => {
    setLoading(true);
    setError("");
    setFieldError("");

    try {
      await secureAxios.put(`/admin/variant-categories/${id}`, {
        name,
        slug: generateSlug(name),
      });
      setEditingId(null);
      fetchVariants();
    } catch (err) {
      const res = err?.response?.data;
      setError(res?.error || "Update failed");
      setFieldError(res?.details?.name || "");
      console.error("Update failed:", res);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this variant category?")) return;
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

      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="e.g. Size, Color"
          className={`w-full px-4 py-2 rounded-md bg-[#1e2633] text-white border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            fieldError ? "border-red-500" : "border-gray-600"
          }`}
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      {fieldError && <p className="text-sm text-red-400 mt-1">{fieldError}</p>}

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
              className={`w-full px-4 py-2 rounded-md bg-[#2a3444] text-white border focus:outline-none mr-4 ${
                fieldError ? "border-red-500" : "border-gray-600"
              }`}
            />
          ) : (
            <span className="font-medium text-lg">{variant.name}</span>
          )}

          <div className="flex gap-3 ml-4">
            {editingId === variant._id ? (
              <button
                onClick={() => setEditingId(null)}
                className="px-3 py-1 rounded-md bg-gray-600 text-white hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={() => setEditingId(variant._id)}
                className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => handleDelete(variant._id)}
              className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
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
