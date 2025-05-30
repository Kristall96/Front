import { useEffect, useState } from "react";
import secureAxios from "../../../../utils/secureAxios";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await secureAxios.get("/admin/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!newCategory.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await secureAxios.post("/admin/categories", {
        name: newCategory,
      });
      console.log("Category created:", res.data);
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("Create error", err?.response?.data || err.message);
      setError(err?.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
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
      await secureAxios.post(`/admin/categories/${catId}/subcategories`, {
        name: subName,
      });
      fetchCategories();
    } catch (err) {
      console.error("Subcategory add error", err);
    }
  };

  const handleDeleteSub = async (catId, subSlug) => {
    try {
      await secureAxios.delete(
        `/admin/categories/${catId}/subcategories/${subSlug}`
      );
      fetchCategories();
    } catch (err) {
      console.error("Subcategory delete error", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        📂 Manage Categories
      </h2>

      {/* Add New Category */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newCategory}
          placeholder="New category name"
          onChange={(e) => setNewCategory(e.target.value)}
          className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
        />
        <button
          className="btn btn-primary"
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? "Adding..." : "+ Add"}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Category List */}
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="bg-gray-50 dark:bg-gray-700 p-4 rounded shadow-sm mb-4"
        >
          <div className="flex justify-between items-center">
            {editingCategory === cat._id ? (
              <div className="flex gap-2 w-full">
                <input
                  defaultValue={cat.name}
                  className="input input-sm input-bordered flex-1 dark:bg-gray-600 dark:text-white"
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
                <p className="font-semibold text-gray-900 dark:text-white">
                  {cat.name}
                </p>
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
          <div className="mt-3 pl-4 border-l-2 border-dashed border-gray-400 dark:border-gray-600">
            {cat.subcategories.map((sub) => (
              <div
                key={sub._id}
                className="flex justify-between text-sm items-center mb-1"
              >
                <span className="text-gray-800 dark:text-gray-300">
                  {sub.name}
                </span>
                <button
                  className="text-xs text-red-500 hover:underline"
                  onClick={() => handleDeleteSub(cat._id, sub.slug)}
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Subcategory form */}
            <AddSubForm onAdd={(name) => handleAddSub(cat._id, name)} />
          </div>
        </div>
      ))}
    </div>
  );
};

// Inline subcategory form
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
        className="input input-sm input-bordered w-full dark:bg-gray-600 dark:text-white"
      />
      <button
        className="btn text-white"
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
