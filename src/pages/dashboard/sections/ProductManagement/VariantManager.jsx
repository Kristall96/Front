import { useEffect, useState } from "react";
import secureAxios from "../../../utils/secureAxios";

const VariantManager = () => {
  const [variants, setVariants] = useState([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

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
    try {
      await secureAxios.post("/admin/variant-categories", { name: newName });
      setNewName("");
      fetchVariants();
    } catch (err) {
      console.error("Failed to add variant category:", err);
    }
    setLoading(false);
  };

  const handleUpdate = async (id, name) => {
    try {
      await secureAxios.put(`/admin/variant-categories/${id}`, { name });
      setEditingId(null);
      fetchVariants();
    } catch (err) {
      console.error("Failed to update variant:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this variant category?"))
      return;
    try {
      await secureAxios.delete(`/admin/variant-categories/${id}`);
      fetchVariants();
    } catch (err) {
      console.error("Failed to delete variant category:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-6">
      <h2 className="text-xl font-bold text-gray-700">🧩 Variant Categories</h2>

      {/* Add New Variant Category */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="e.g. Size, Color"
          className="input input-bordered w-full"
        />
        <button
          className="btn btn-primary"
          onClick={handleAdd}
          disabled={loading}
        >
          + Add
        </button>
      </div>

      {/* List of Variant Categories */}
      {variants.map((variant) => (
        <div
          key={variant._id}
          className="flex items-center justify-between border p-3 rounded bg-gray-50 mb-2"
        >
          {editingId === variant._id ? (
            <input
              defaultValue={variant.name}
              className="input input-sm input-bordered w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdate(variant._id, e.target.value);
                }
              }}
            />
          ) : (
            <span className="font-medium text-gray-800">{variant.name}</span>
          )}

          <div className="flex gap-2">
            {editingId === variant._id ? (
              <button className="btn btn-sm" onClick={() => setEditingId(null)}>
                Cancel
              </button>
            ) : (
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setEditingId(variant._id)}
              >
                Edit
              </button>
            )}
            <button
              className="btn btn-sm btn-error text-white"
              onClick={() => handleDelete(variant._id)}
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
