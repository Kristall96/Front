import { useEffect, useState } from "react";
import secureAxios from "../../../../utils/secureAxios";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await secureAxios.get("/admin/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!newCategory.trim()) return;
    setLoading(true);
    try {
      await secureAxios.post("/admin/categories", { name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("Create error", err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await secureAxios.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handleEdit = async (id, newName) => {
    try {
      await secureAxios.put(`/admin/categories/${id}`, { name: newName });
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      console.error("Edit error", err);
    }
  };

  const handleAddSub = async (catId, subName) => {
    if (!subName.trim()) return;
    try {
      await secureAxios.post(`/admin/categories/${catId}/sub`, {
        name: subName,
      });
      fetchCategories();
    } catch (err) {
      console.error("Subcategory add error", err);
    }
  };

  const handleDeleteSub = async (catId, subId) => {
    try {
      await secureAxios.delete(`/admin/categories/${catId}/sub/${subId}`);
      fetchCategories();
    } catch (err) {
      console.error("Subcategory delete error", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-6">
      <h2 className="text-xl font-bold mb-4 text-gray-700">
        📂 Manage Categories
      </h2>

      {/* Add New Category */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="input input-bordered w-full"
        />
        <button
          className="btn btn-primary"
          onClick={handleCreate}
          disabled={loading}
        >
          + Add
        </button>
      </div>

      {/* Category List */}
      {categories.map((cat) => (
        <div key={cat._id} className="border p-4 rounded mb-2 bg-gray-50">
          {/* Category name or edit input */}
          <div className="flex items-center justify-between">
            {editingCategory === cat._id ? (
              <div className="flex gap-2 w-full">
                <input
                  defaultValue={cat.name}
                  className="input input-sm input-bordered flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEdit(cat._id, e.target.value);
                  }}
                />
                <button
                  className="btn btn-sm"
                  onClick={() => setEditingCategory(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <p className="font-semibold text-gray-800">{cat.name}</p>
                <div className="flex gap-2">
                  <button
                    className="btn btn-xs btn-outline"
                    onClick={() => setEditingCategory(cat._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-xs btn-error text-white"
                    onClick={() => handleDelete(cat._id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Subcategories */}
          <div className="mt-2 pl-4 border-l-2 border-dashed">
            {cat.subcategories.map((sub) => (
              <div
                key={sub._id}
                className="flex justify-between items-center text-sm py-1"
              >
                <span className="text-gray-700">{sub.name}</span>
                <button
                  className="text-xs text-red-500 hover:underline"
                  onClick={() => handleDeleteSub(cat._id, sub._id)}
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Add subcategory */}
            <AddSubForm onAdd={(name) => handleAddSub(cat._id, name)} />
          </div>
        </div>
      ))}
    </div>
  );
};

// 💡 Small inline subcategory form
const AddSubForm = ({ onAdd }) => {
  const [name, setName] = useState("");
  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        value={name}
        placeholder="Add subcategory"
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onAdd(name);
            setName("");
          }
        }}
        className="input input-sm input-bordered w-full"
      />
      <button
        className="btn btn-sm btn-secondary"
        onClick={() => {
          onAdd(name);
          setName("");
        }}
      >
        Add
      </button>
    </div>
  );
};

export default CategoryManager;
